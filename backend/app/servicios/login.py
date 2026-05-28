from app.utilidades.seguridad import (verificar_contrasenia, crear_token)
from app.configuracion.database import db

class Login:

    @staticmethod
    def iniciar_sesion(
		correo,
		contrasenia
    ):

        query = """
        MATCH (u:User {correo: $correo})
        RETURN u
        """

        with db.driver.session() as session:

            resultado = session.run(query, correo=correo)

            busqueda = resultado.single()

            if not busqueda:
                return None

            usuario = busqueda["u"]

            if not verificar_contrasenia(contrasenia, usuario["contrasenia"]):
                return None

            token = crear_token({
				"id_usuario": usuario["id_usuario"],
                "correo": usuario["correo"]
            })

            return {
				"token": token,
				"id_usuario": usuario["id_usuario"],
				"nombre_usuario": usuario["nombre_usuario"]
				
			}