from fastapi import FastAPI

from app.rutas import rutasRecomendacion

app = FastAPI()

app.include_router(
    rutasRecomendacion.router,
    prefix="/recomendacion"
)