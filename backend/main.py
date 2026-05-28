from fastapi import FastAPI

from app.rutas import (auth_routes, rutasRecomendacion)

app = FastAPI()

app.include_router(
    auth_routes.router,
    prefix="/auth"
)

app.include_router(
    rutasSociales.router
    prefix="/social"
)