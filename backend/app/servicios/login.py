from app.configuracion.database import db


class Login:

    @staticmethod
    def iniciar_sesion(id_usuario: int):
        """
        Login temporal por id directo.
        No requiere correo ni contraseña.
        """

        query = """
        MATCH (u:Usuario {id: $id_usuario})
        RETURN u
        """

        with db.driver.session(database="biblioteca") as session:

            resultado = session.run(query, id_usuario=id_usuario)
            busqueda = resultado.single()

            if not busqueda:
                return None

            usuario = busqueda["u"]

            return {
                "token": "temp",
                "id_usuario": str(usuario["id"]),
                "nombre_usuario": usuario["nombre"]
            }