from typing import Optional
from app.modelo.libro import Libro
from app.configuracion.database import db


class ServicioLibros:

    @staticmethod
    def buscar_libros(
        search: Optional[str] = None,
        autor:  Optional[str] = None,
        genero: Optional[str] = None,
        limit:  int = 20
    ):
        """
        Busca libros con filtros opcionales.
        - search: coincidencia parcial en título (case-insensitive)
        - autor:  filtro exacto por autor
        - genero: filtro exacto por género
        - limit:  máximo de resultados
        """

        # Construimos la query dinámicamente según los filtros recibidos
        condiciones = []

        if search:
            condiciones.append(
                "toLower(b.titulo) CONTAINS toLower($search)"
            )
        if autor:
            condiciones.append("b.autor = $autor")
        if genero:
            condiciones.append("b.genero = $genero")

        where_clause = (
            "WHERE " + " AND ".join(condiciones)
            if condiciones
            else ""
        )

        query = f"""
        MATCH (b:Libro)
        {where_clause}
        RETURN
            b.titulo AS titulo,
            b.autor  AS autor,
            b.genero AS genero,
            b.rating AS rating,
            b.year   AS year
        ORDER BY b.rating DESC
        LIMIT $limit
        """

        params = {
            "search": search or "",
            "autor":  autor  or "",
            "genero": genero or "",
            "limit":  limit
        }

        with db.driver.session(database="biblioteca") as session:
            resultado = session.run(query, **params)
            return [
                {
                    "titulo": r["titulo"],
                    "autor":  r["autor"],
                    "genero": r["genero"],
                    "rating": r["rating"],
                    "year":   r["year"],
                }
                for r in resultado
            ]

    @staticmethod
    def obtener_libro(titulo: str):
        """Busca un libro por título y devuelve sus datos"""
        query = """
        MATCH (b:Libro {titulo: $titulo})
        RETURN
            b.titulo    AS titulo,
            b.autor     AS autor,
            b.genero    AS genero,
            b.rating    AS rating,
            b.year      AS year
        """
        with db.driver.session(database="biblioteca") as session:
            resultado = session.run(query, titulo=titulo).single()
            if not resultado:
                return None
            return {
                "titulo": resultado["titulo"],
                "autor":  resultado["autor"],
                "genero": resultado["genero"],
                "rating": resultado["rating"],
                "year":   resultado["year"],
            }

    @staticmethod
    def libro_leido_por_titulo(id_usuario: str, titulo: str, puntuacion: float):
        """Crea/actualiza relación LEYO entre usuario y libro usando título"""
        if puntuacion < 1 or puntuacion > 10:
            raise ValueError("La puntuación debe ser entre 1 y 10")

        peso = puntuacion / 2

        query = """
        MATCH (u:Usuario {id: $id_usuario})
        MATCH (b:Libro   {titulo: $titulo})
        MERGE (u)-[r:LEYO]->(b)
        SET r.puntuacion = $puntuacion,
            r.peso       = $peso
        RETURN r
        """
        with db.driver.session(database="biblioteca") as session:
            session.run(
                query,
                id_usuario=int(id_usuario),
                titulo=titulo,
                puntuacion=puntuacion,
                peso=peso
            )

    @staticmethod
    def libro_favorito_por_titulo(id_usuario: str, titulo: str):
        """Crea relación FAVORITO entre usuario y libro usando título"""
        query = """
        MATCH (u:Usuario {id: $id_usuario})
        MATCH (b:Libro   {titulo: $titulo})
        MERGE (u)-[r:FAVORITO]->(b)
        SET r.peso = 5
        """
        with db.driver.session(database="biblioteca") as session:
            session.run(
                query,
                id_usuario=int(id_usuario),
                titulo=titulo
            )

    # ── Métodos originales por id_libro (se mantienen) ───────────────

    @staticmethod
    def crear_libro(titulo, autor, descripcion, generos):
        nuevo_libro = Libro(
            titulo=titulo,
            autor=autor,
            descripcion=descripcion,
            generos=generos
        )
        query = """
        CREATE (b:Libro {
            id_libro:    $id_libro,
            titulo:      $titulo,
            autor:       $autor,
            descripcion: $descripcion
        })
        WITH b
        UNWIND $generos AS nombre_genero
        MERGE (g:Genero {nombre: nombre_genero})
        ON CREATE SET g.id_genero = randomUUID()
        MERGE (b)-[:PERTENECE_A]->(g)
        RETURN b
        """
        with db.driver.session(database="biblioteca") as session:
            session.run(
                query,
                id_libro=nuevo_libro.id_libro,
                titulo=nuevo_libro.titulo,
                autor=nuevo_libro.autor,
                descripcion=nuevo_libro.descripcion,
                generos=nuevo_libro.generos
            )
        return {"mensaje": "Libro creado", "id_libro": nuevo_libro.id_libro}

    @staticmethod
    def libro_leido(id_usuario, id_libro, puntuacion):
        if puntuacion < 1 or puntuacion > 10:
            raise ValueError("La puntuación debe ser entre 1 y 10")
        peso = puntuacion / 2
        query = """
        MATCH (u:Usuario {id_usuario: $id_usuario})
        MATCH (b:Libro   {id_libro:   $id_libro})
        MERGE (u)-[r:LEYO]->(b)
        SET r.puntuacion = $puntuacion,
            r.peso       = $peso
        RETURN r
        """
        with db.driver.session(database="biblioteca") as session:
            session.run(
                query,
                id_usuario=id_usuario,
                id_libro=id_libro,
                puntuacion=puntuacion,
                peso=peso
            )

    @staticmethod
    def libro_favorito(id_usuario, id_libro):
        query = """
        MATCH (u:Usuario {id_usuario: $id_usuario})
        MATCH (b:Libro   {id_libro:   $id_libro})
        MERGE (u)-[r:FAVORITO]->(b)
        SET r.peso = 5
        """
        with db.driver.session(database="biblioteca") as session:
            session.run(query, id_usuario=id_usuario, id_libro=id_libro)

    @staticmethod
    def genero_favorito(id_usuario, id_genero):
        query = """
        MATCH (u:Usuario {id_usuario: $id_usuario})
        MATCH (g:Genero  {id_genero:  $id_genero})
        MERGE (u)-[r:PREFIERE]->(g)
        SET r.peso = 4
        """
        with db.driver.session(database="biblioteca") as session:
            session.run(query, id_usuario=id_usuario, id_genero=id_genero)