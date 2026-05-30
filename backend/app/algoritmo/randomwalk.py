from collections import defaultdict
import random

from app.configuracion.database import db


class Randomwalk:

    def __init__(
        self,
        probabilidad_reinicio=0.3,
        pasos=500
    ):

        self.probabilidad_reinicio = probabilidad_reinicio
        self.pasos = pasos

    def recomendar(self, id_usuario):

        visitas = defaultdict(int)

        current_node = {
            "label": "Usuario",
            "id": int(id_usuario)
        }

        libros_leidos = self.obtener_libros_leidos(
            id_usuario
        )

        with db.driver.session(
            database="59125830"
        ) as session:

            for _ in range(self.pasos):

                if (
                    random.random()
                    < self.probabilidad_reinicio
                ):

                    current_node = {
                        "label": "Usuario",
                        "id": int(id_usuario)
                    }

                query = """
                MATCH (n)-[r]-(m)

                WHERE
                    (
                        n:Usuario
                        AND n.id = $id_nodo
                    )

                    OR

                    (
                        n:Libro
                        AND n.titulo = $id_nodo
                    )

                    OR

                    (
                        n:Genero
                        AND n.nombre = $id_nodo
                    )

                RETURN
                    labels(m)[0] AS label,

                    m.id AS id_usuario,
                    m.titulo AS titulo,
                    m.nombre AS genero,

                    r.puntuacion AS peso
                """

                id_nodo = (
                    current_node.get("id")
                    or current_node.get("titulo")
                    or current_node.get("genero")
                )

                resultado = session.run(
                    query,
                    id_nodo=id_nodo
                )

                vecinos = []

                for r in resultado:

                    label = r["label"]
                    peso = r["peso"] or 1

                    if label == "Usuario":
                        peso += 2

                    for _ in range(int(peso)):

                        if label == "Usuario":

                            vecinos.append({
                                "label": label,
                                "id": r["id_usuario"]
                            })

                        elif label == "Libro":

                            vecinos.append({
                                "label": label,
                                "titulo": r["titulo"]
                            })

                        elif label == "Genero":

                            vecinos.append({
                                "label": label,
                                "genero": r["genero"]
                            })

                if not vecinos:
                    continue

                current_node = random.choice(
                    vecinos
                )

                if (
                    current_node["label"]
                    == "Libro"
                ):

                    titulo = current_node["titulo"]

                    if titulo not in libros_leidos:
                        visitas[titulo] += 1

        recomendaciones = sorted(
            visitas.items(),
            key=lambda x: x[1],
            reverse=True
        )

        resultado_final = []

        with db.driver.session(
            database="59125830"
        ) as session:

            for titulo, cantidad_visitas in recomendaciones[:10]:

                query = """
                MATCH (b:Libro {
                    titulo: $titulo
                })

                RETURN
                    b.titulo AS titulo,
                    b.autor AS autor,
                    b.genero AS genero,
                    b.rating AS rating,
                    b.year AS year
                """

                libro = session.run(
                    query,
                    titulo=titulo
                ).single()

                if libro:

                    resultado_final.append({

                        "titulo": libro["titulo"],
                        "autor": libro["autor"],
                        "genero": libro["genero"],
                        "rating": libro["rating"],
                        "year": libro["year"],
                        "visitas": cantidad_visitas

                    })

        return resultado_final

    def obtener_libros_leidos(
        self,
        id_usuario
    ):

        query = """
        MATCH (u:Usuario {
            id: $id_usuario
        })-[:LEYO]->(b:Libro)

        RETURN b.titulo AS titulo
        """

        libros = []

        with db.driver.session(
            database="59125830"
        ) as session:

            resultado = session.run(
                query,
                id_usuario=int(id_usuario)
            )

            for r in resultado:

                libros.append(
                    r["titulo"]
                )

        return libros