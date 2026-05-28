import uuid

class Libro:

    def __init__(
		self,
		titulo,
		autor, 
		descripcion, 
		generos=None
	):
	
		self.id_libro = str(uuid.uuid4())
        self.titulo = titulo
        self.autor = autor
        self.descripcion = descripcion
        self.generos = generos or []