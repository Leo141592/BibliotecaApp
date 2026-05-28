from app.modelos.usuario import Usuario
from app.config.database import db
from app.utilidades.seguridad import (encriptar_contrasenia)

class Registro:

    @staticmethod
    def registrar_usuario(
		nombre_usuario, 
		correo, 
		contrasenia):

        encriptado = encriptar_contrasenia(contrasenia)
        
        nuevo_usuario = Usuario(
            nombre_usuario=nombre_usuario,
            correo=correo,
            contrasenia=encriptado
        )

        query = """
        CREATE (u:User {
            id_usuario: $id_usuario,
            nombre_usuario: $nombre_usuario,
            correo: $correo,
            contraseña: $contrasenia
        })
        RETURN u
        """

        with db.driver.session() as session:
            session.run(
				query,
				id_usuario=nuevo_usuario.id_usuario,
                nombre_usuario=nuevo_usuario.nombre_usuario,
                correo=nuevo_usuario.correo,
                contrasenia=nuevo_usuario.contrasenia,
            )

            return {
				"mensaje": "Usuario creado",
				"id_usuario": nuevo_usuario.id_usuario
			}