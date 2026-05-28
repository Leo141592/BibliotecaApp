from fastapi import APIRouter

from app.servicios.servicioRecomendacion import (ServicioRecomendacion)
from app.servicios.servicioAmigos import(ServicioAmigos)

router = APIRouter()

@router.get("/usuario/{id_usuario}")

def recomendar_libros(id_usuario: str):

    return (ServicioRecomendacion.obtenerRecomendaciones(id_usuario))
    
@router.post("/agregar")

def agregar_amigo(
    id_usuario_1: str,
    id_usuario_2: str
):

    return ServicioAmigos.agregar_amigo(id_usuario_1, id_usuario_2)