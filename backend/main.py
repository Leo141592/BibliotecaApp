from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.rutas.rutasRecomendacion import router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "mensaje": "API funcionando"
    }

app.include_router(router)