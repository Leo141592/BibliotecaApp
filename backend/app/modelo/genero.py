import uuid

class Genero:

    def __init__(
		self,
		nombre
	):
	
		self.id_genero = str(uuid.uuid4())
        self.nombre = nombre