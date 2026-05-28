from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

pwd_context = CryptContext(
	schemes=["bcrypt"]
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def encriptar_contrasenia(contrasenia):
    return pwd_context.hash(contrasenia)

def verificar_contrasenia(contrasenia, encriptado):
    return pwd_context.verify(contrasenia, encriptado)

def crear_token(datos: dict):

	data_copy = data.copy()
    vence = datetime.utcnow() + timedelta(hours=24)

    data_copy.update({"fecha de expiración": vence})

    return jwt.encode(
        data_copy,
        SECRET_KEY,
        algorithm=ALGORITHM
    )