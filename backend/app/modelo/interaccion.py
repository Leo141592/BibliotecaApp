import uuid
from datetime import datetime

class Interaction:

    def __init__(
		self, 
		id_usuario, 
		id_libro, 
		tipo_interaccion, 
		puntuacion=None
	):
	
		if puntuacion is not None:
			if puntuacion < 1 or puntuacion > 10:
				raise ValueError("La puntuación debe ser entre 1 y 10")

        self.id_interaccion = str(uuid.uuid4())

        self.id_usuario = id_usuario
        self.id_libro = id_libro

        self.tipo_interaccion = tipo_interaccion

        self.puntuacion = puntuacion

        self.fecha_creacion = datetime.utcnow()