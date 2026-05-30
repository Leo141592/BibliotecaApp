from app.configuracion.database import db


class Registro:

    @staticmethod
    def registrar_usuario(nombre: str, contrasenia: str):

        # ── 1. Calcular el próximo id ────────────────────────────────
        # Contamos los usuarios existentes y sumamos 1.
        # Neo4j no tiene auto-increment nativo, así que lo hacemos
        # con una query de agregación dentro de la misma sesión.
        with db.driver.session(database="59125830") as session:

            resultado_id = session.run(
                "MATCH (u:Usuario) RETURN count(u) AS total"
            ).single()

            nuevo_id = (resultado_id["total"] or 0) + 1

            # ── 2. Verificar que el nombre no exista ya ───────────────
            existe = session.run(
                "MATCH (u:Usuario {nombre: $nombre}) RETURN u LIMIT 1",
                nombre=nombre
            ).single()

            if existe:
                raise ValueError("El nombre de usuario ya está en uso")

            # ── 3. Crear el nodo con el mismo esquema de la DB ────────
            session.run(
                """
                CREATE (:Usuario {
                    id:          $id,
                    nombre:      $nombre,
                    contrasenia: $contrasenia,
                    edad:        0,
                    preferencia: ""
                })
                """,
                id=nuevo_id,
                nombre=nombre,
                contrasenia=contrasenia
            )

        return {
            "mensaje":    "Usuario creado",
            "id_usuario": nuevo_id,
            "nombre":     nombre
        }