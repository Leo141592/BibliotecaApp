import uuid

class Usuario:
	
    def __init__(
		self,
		nombre_usuario,
		correo, 
		contrasenia
	):
	
		self.id_usuario = str(uuid.uuid4())
        self.nombre_usuario = nombre_usuario
        self.correo = correo
        self.contrasenia = contrasenia