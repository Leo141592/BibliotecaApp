from app.configuracion.database import db


class Login:

    @staticmethod
    def iniciar_sesion(nombre: str, contrasenia: str):

        query = """
        MATCH (u:Usuario {nombre: $nombre})
        RETURN u
        """

        with db.driver.session(database="59125830") as session:

            resultado = session.run(query, nombre=nombre).single()

            if not resultado:
                return None

            usuario = resultado["u"]

            # Verificar contraseña (comparación directa, sin hash)
            if usuario["contrasenia"] != contrasenia:
                return None

            return {
                "token":         "temp",
                "id_usuario":    str(usuario["id"]),
                "nombre_usuario": usuario["nombre"]
            }