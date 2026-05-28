from app.modelo.libro import Libro
from app.configuracion.database import db

class ServicioLibros:

    @staticmethod
    def crear_libro(
		titulo,
		autor,
		descripcion, 
		generos
    ):

        nuevo_libro = Libro(
            titulo=titulo,
            autor=autor,
            descripcion=descripcion,
            generos=generos
        )

        query = """
        CREATE (b:Book {
            id_libro: $id_libro,
            titulo: $titulo,
            autor: $autor,
            descripcion: $descripcion
        })

        WITH b

        UNWIND $generos AS nombre_genero

        MERGE (g:Genre {nombre: nombre_genero})

        ON CREATE SET
            g.id_genero = randomUUID()

        MERGE (b)-[:PERTENECE_A]->(g)

        RETURN b
        """

        with db.driver.session() as session:

            session.run(
                query,
                id_libro=nuevo_libro.id_libro,
                titulo=nuevo_libro.titulo,
                autor=nuevo_libro.autor,
                descripcion=nuevo_libro.descripcion,
                generos=nuevo_libro.generos
            )

        return {
            "mensaje": "Libro creado",
            "id_libro": nuevo_libro.id_libro
        }

    @staticmethod
    def libro_leido(id_usuario, id_libro, puntuacion):
		
		if puntuacion < 1 or puntuacion > 10:
			raise ValueError("La puntuación debe ser entre 1 y 10")
		
		peso = puntuacion / 2

        query = """
        MATCH (u:User {id_usuario: $id_usuario})

        MATCH (b:Book {id_libro: $id_libro})

        MERGE (u)-[r:LEYO]->(b)

        SET r.puntuacion = $puntuacion
        SET r.peso = 3

        RETURN r
        """

        with db.driver.session() as session:

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
        MATCH (u:User {id_usuario: $id_usuario})

        MATCH (b:Book {id_libro: $id_libro})

        MERGE (u)-[r:FAVORITO]->(b)
        
        SET r.peso = 5
        """

        with db.driver.session() as session:

            session.run(
                query,
                id_usuario=id_usuario,
                id_libro=id_libro
            )

    @staticmethod
    def genero_favorito(id_usuario, id_genero):

        query = """
        MATCH (u:User {id_usuario: $id_usuario})

        MATCH (g:Genre {id_genero: $id_genero})

        MERGE (u)-[r:PREFIERE]->(g)
        
        SET r.peso = 4
        """

        with db.driver.session() as session:

            session.run(
                query,
                id_usuario=id_usuario,
                id_genero=id_genero
            )