from app.configuracion.database import db


class ServicioUsuario:

    @staticmethod
    def obtener_estadisticas(id_usuario: int):

        print(f"[DEBUG] obtener_estadisticas llamado con id_usuario={id_usuario} tipo={type(id_usuario)}")

        query = """
        MATCH (u:Usuario {id: $id_usuario})-[:LEYO]->(b:Libro)
        RETURN
            count(b)          AS libros_leidos,
            collect(b.autor)  AS autores,
            collect(b.genero) AS generos
        """

        with db.driver.session(database="59125830") as session:

            resultado = session.run(
                query,
                id_usuario=id_usuario
            ).single()

            print(f"[DEBUG] resultado crudo: {resultado}")

        if not resultado or resultado["libros_leidos"] == 0:
            return {
                "libros_leidos": 0,
                "autor_mas_leido": "—",
                "genero_mas_leido": "—"
            }

        libros_leidos = resultado["libros_leidos"]
        autores       = resultado["autores"]
        generos       = resultado["generos"]

        print(f"[DEBUG] libros_leidos={libros_leidos}, autores={autores[:3]}, generos={generos[:3]}")

        conteo_autores = {}
        for a in autores:
            if a:
                conteo_autores[a] = conteo_autores.get(a, 0) + 1

        conteo_generos = {}
        for g in generos:
            if g:
                conteo_generos[g] = conteo_generos.get(g, 0) + 1

        autor_mas_leido = max(
            conteo_autores, key=conteo_autores.get
        ) if conteo_autores else "—"

        genero_mas_leido = max(
            conteo_generos, key=conteo_generos.get
        ) if conteo_generos else "—"

        return {
            "libros_leidos": libros_leidos,
            "autor_mas_leido": autor_mas_leido,
            "genero_mas_leido": genero_mas_leido
        }

    @staticmethod
    def obtener_favoritos(id_usuario: int):

        print(f"[DEBUG] obtener_favoritos llamado con id_usuario={id_usuario} tipo={type(id_usuario)}")

        query = """
        MATCH (u:Usuario {id: $id_usuario})-[:FAVORITO]->(b:Libro)
        RETURN
            b.titulo  AS titulo,
            b.autor   AS autor,
            b.genero  AS genero,
            b.rating  AS rating,
            b.year    AS year
        """

        with db.driver.session(database="59125830") as session:

            resultado = session.run(query, id_usuario=id_usuario)
            libros = [
                {
                    "titulo": r["titulo"],
                    "autor":  r["autor"],
                    "genero": r["genero"],
                    "rating": r["rating"],
                    "year":   r["year"]
                }
                for r in resultado
            ]

        print(f"[DEBUG] favoritos encontrados: {len(libros)}")

        return libros