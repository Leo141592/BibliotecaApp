from fastapi import FastAPI
from app.rutas.rutasRecomendacion import router

app = FastAPI()

@app.get("/")
def root():
    return {
        "mensaje": "API funcionando"
    }

app.include_router(router)