from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

pwd_context = CryptContext(schemes=["bcrypt"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


def encriptar_contrasenia(contrasenia):
    return pwd_context.hash(contrasenia)


def verificar_contrasenia(contrasenia, encriptado):
    return pwd_context.verify(contrasenia, encriptado)


def crear_token(datos: dict):
    #  FIX: era `data.copy()` pero el parámetro se llama `datos`
    data_copy = datos.copy()
    vence = datetime.utcnow() + timedelta(hours=24)
    data_copy.update({"exp": vence})  # ✅ FIX: "fecha de expiración" → "exp" (estándar JWT)

    return jwt.encode(data_copy, SECRET_KEY, algorithm=ALGORITHM)