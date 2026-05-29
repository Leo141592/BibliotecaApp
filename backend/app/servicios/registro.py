from app.modelo.usuario import Usuario         #  FIX: era app.modelos.usuario
from app.configuracion.database import db      #  FIX: era app.config.database
from app.utilidades.seguridad import encriptar_contrasenia


class Registro:

    @staticmethod
    def registrar_usuario(nombre_usuario, correo, contrasenia):

        encriptado = encriptar_contrasenia(contrasenia)

        nuevo_usuario = Usuario(
            nombre_usuario=nombre_usuario,
            correo=correo,
            contrasenia=encriptado
        )

        query = """
        CREATE (u:Usuario {
            id_usuario: $id_usuario,
            nombre_usuario: $nombre_usuario,
            correo: $correo,
            contrasenia: $contrasenia
        })
        RETURN u
        """

        with db.driver.session(database="biblioteca") as session:
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