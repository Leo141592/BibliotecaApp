import uuid


class Genero:

    def __init__(self, nombre):
        #  FIX: indentación mixta (tabs + espacios) corregida
        self.id_genero = str(uuid.uuid4())
        self.nombre = nombre