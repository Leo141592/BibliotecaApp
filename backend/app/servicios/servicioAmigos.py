from app.configuracion.database import db


class ServicioAmigos:

    @staticmethod
    def agregar_amigo(id_usuario_1, id_usuario_2):

        query = """
        MATCH (u1:Usuario {id: $id_usuario_1})
        MATCH (u2:Usuario {id: $id_usuario_2})
        MERGE (u1)-[r:AMIGO]->(u2)
        SET r.peso = 2
        MERGE (u2)-[r2:AMIGO]->(u1)
        SET r2.peso = 2
        RETURN r
        """

        with db.driver.session(database="59125830") as session:
            session.run(
                query,
                id_usuario_1=int(id_usuario_1),
                id_usuario_2=int(id_usuario_2)
            )

        return {"mensaje": "Amistad agregada"}

    @staticmethod
    def obtener_amigos(id_usuario: int):
        """
        Devuelve la lista de amigos del usuario con sus estadísticas:
        nombre, libros leídos, género favorito y autor favorito.
        """

        query = """
        MATCH (u:Usuario {id: $id_usuario})-[:AMIGO]->(amigo:Usuario)

        OPTIONAL MATCH (amigo)-[:LEYO]->(b:Libro)

        RETURN
            amigo.id        AS id,
            amigo.nombre    AS nombre,
            count(b)        AS libros_leidos,
            collect(b.autor)  AS autores,
            collect(b.genero) AS generos
        """

        with db.driver.session(database="59125830") as session:
            resultado = session.run(query, id_usuario=id_usuario)

            amigos = []

            for r in resultado:

                autores = [a for a in r["autores"] if a]
                generos = [g for g in r["generos"] if g]

                autor_mas_leido = (
                    max(set(autores), key=autores.count)
                    if autores else "—"
                )
                genero_mas_leido = (
                    max(set(generos), key=generos.count)
                    if generos else "—"
                )

                amigos.append({
                    "id":              r["id"],
                    "nombre":          r["nombre"],
                    "libros_leidos":   r["libros_leidos"],
                    "autor_favorito":  autor_mas_leido,
                    "genero_favorito": genero_mas_leido,
                })

        return amigos

    @staticmethod
    def obtener_todos_usuarios(id_usuario: int):
        """
        Devuelve todos los usuarios excepto el usuario actual,
        junto con un flag que indica si ya son amigos.
        """

        query = """
        MATCH (yo:Usuario {id: $id_usuario})
        MATCH (u:Usuario)
        WHERE u.id <> $id_usuario

        OPTIONAL MATCH (yo)-[a:AMIGO]->(u)

        RETURN
            u.id          AS id,
            u.nombre      AS nombre,
            u.preferencia AS preferencia,
            a IS NOT NULL AS ya_es_amigo
        ORDER BY u.nombre
        """

        with db.driver.session(database="59125830") as session:
            resultado = session.run(query, id_usuario=id_usuario)

            return [
                {
                    "id":          r["id"],
                    "nombre":      r["nombre"],
                    "preferencia": r["preferencia"],
                    "ya_es_amigo": r["ya_es_amigo"],
                }
                for r in resultado
            ]