from app.configuracion.database import db


class ServicioAmigos:

    @staticmethod
    def agregar_amigo(id_usuario_1, id_usuario_2):

        query = """
        MATCH (u1:Usuario {id_usuario: $id_usuario_1})
        MATCH (u2:Usuario {id_usuario: $id_usuario_2})
        MERGE (u1)-[r:AMIGO]->(u2)
        SET r.peso = 2
        MERGE (u2)-[r2:AMIGO]->(u1)
        SET r2.peso = 2
        RETURN r
        """
        #  FIX: label `User` → `Usuario`

        with db.driver.session(database="biblioteca") as session:
            session.run(
                query,
                id_usuario_1=id_usuario_1,
                id_usuario_2=id_usuario_2
            )

        return {"mensaje": "Amistad agregada"}