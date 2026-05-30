from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from app.servicios.servicioUsuario import ServicioUsuario
from app.servicios.servicioRecomendacion import ServicioRecomendacion
from app.servicios.servicioAmigos import ServicioAmigos
from app.servicios.servicioLibros import ServicioLibros
from app.servicios.login import Login
from app.servicios.registro import Registro

router = APIRouter()


# ── Modelos de request ──────────────────────────────────────────────

class LoginRequest(BaseModel):
    nombre:      str
    contrasenia: str

class RegistroRequest(BaseModel):
    nombre:      str
    contrasenia: str

class AmigoRequest(BaseModel):
    id_usuario_1: str
    id_usuario_2: str

class LibroLeidoRequest(BaseModel):
    id_usuario: str
    titulo:     str
    puntuacion: float

class LibroFavoritoRequest(BaseModel):
    id_usuario: str
    titulo:     str


# ── Rutas auth ──────────────────────────────────────────────────────

@router.get("/test")
def test():
    return {"mensaje": "Backend conectado correctamente"}

@router.post("/login")
def iniciar_sesion(body: LoginRequest):
    resultado = Login.iniciar_sesion(body.nombre, body.contrasenia)
    if not resultado:
        raise HTTPException(status_code=401, detail="Nombre o contraseña incorrectos")
    return resultado

@router.post("/registro")
def registrar_usuario(body: RegistroRequest):
    try:
        return Registro.registrar_usuario(body.nombre, body.contrasenia)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


# ── Rutas libros ────────────────────────────────────────────────────

@router.get("/libros/buscar")
def buscar_libros(
    search: Optional[str] = Query(default=None),
    autor:  Optional[str] = Query(default=None),
    genero: Optional[str] = Query(default=None),
    limit:  int           = Query(default=20, ge=1, le=100)
):
    return ServicioLibros.buscar_libros(
        search=search,
        autor=autor,
        genero=genero,
        limit=limit
    )

@router.get("/libro/{titulo}")
def obtener_libro(titulo: str):
    resultado = ServicioLibros.obtener_libro(titulo)
    if not resultado:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return resultado

@router.post("/libro-leido")
def marcar_leido(body: LibroLeidoRequest):
    try:
        ServicioLibros.libro_leido_por_titulo(
            body.id_usuario,
            body.titulo,
            body.puntuacion
        )
        return {"mensaje": "Libro marcado como leído"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/libro-favorito")
def marcar_favorito(body: LibroFavoritoRequest):
    ServicioLibros.libro_favorito_por_titulo(
        body.id_usuario,
        body.titulo
    )
    return {"mensaje": "Libro marcado como favorito"}


# ── Rutas recomendaciones ───────────────────────────────────────────

@router.get("/usuario/{id_usuario}")
def recomendar_libros(id_usuario: str):
    if not id_usuario or id_usuario in ("undefined", "null"):
        raise HTTPException(status_code=400, detail="id_usuario inválido")
    return ServicioRecomendacion.obtenerRecomendaciones(id_usuario)


# ── Rutas amigos ────────────────────────────────────────────────────

@router.get("/usuarios")
def obtener_todos_usuarios(id_usuario: int = Query(...)):
    return ServicioAmigos.obtener_todos_usuarios(id_usuario)

@router.get("/usuario/{id_usuario}/amigos")
def obtener_amigos(id_usuario: str):
    return ServicioAmigos.obtener_amigos(int(id_usuario))

@router.post("/agregar-amigo")
def agregar_amigo(body: AmigoRequest):
    return ServicioAmigos.agregar_amigo(
        body.id_usuario_1,
        body.id_usuario_2
    )


# ── Rutas cuenta ────────────────────────────────────────────────────

@router.get("/usuario/{id_usuario}/estadisticas")
def obtener_estadisticas(id_usuario: str):
    return ServicioUsuario.obtener_estadisticas(int(id_usuario))

@router.get("/usuario/{id_usuario}/favoritos")
def obtener_favoritos(id_usuario: str):
    return ServicioUsuario.obtener_favoritos(int(id_usuario))