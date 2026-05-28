import random
from collections import defaultdict

from app.configuracion.database import db


class Randomwalk:

    def __init__(self, probabilidad_reinicio=0.3, pasos=500):

        self.probabilidad_reinicio = probabilidad_reinicio
        self.pasos = pasos

    def recomendar(self, id_usuario):

        visitas = defaultdict(int)

        current_node = {
            "label": "User",
            "id_usuario": id_usuario
        }

        libros_leidos = self.obtener_libros_leidos(id_usuario)

        with db.driver.session() as session:

            for _ in range(self.pasos):

                if random.random() < self.probabilidad_reinicio:

                    current_node = {
                        "label": "User",
                        "id_usuario": id_usuario
                    }

                query = """
                MATCH (n)-[r]-(m)

                WHERE
                    (
                        n:User
                        AND n.id_usuario = $id_nodo
                    )

                    OR

                    (
                        n:Book
                        AND n.id_libro = $id_nodo
                    )

                    OR

                    (
                        n:Genre
                        AND n.id_genero = $id_nodo
                    )

                RETURN
                    labels(m)[0] AS label,

                    m.id_usuario AS id_usuario,
                    m.id_libro AS id_libro,
                    m.id_genero AS id_genero,

                    r.peso AS peso
                """

                id_nodo = (
                    current_node.get("id_usuario")
                    or current_node.get("id_libro")
                    or current_node.get("id_genero")
                )

                resultado = session.run(
                    query,
                    id_nodo=id_nodo
                )

                vecinos = []

                for r in resultado:

                    label = r["label"]
                    peso = r["peso"] or 1

                    if label == "User":
                        peso += 2

                    for _ in range(peso):

                        if label == "User":

                            vecinos.append({
                                "label": label,
                                "id_usuario": r["id_usuario"]
                            })

                        elif label == "Book":

                            vecinos.append({
                                "label": label,
                                "id_libro": r["id_libro"]
                            })

                        elif label == "Genre":

                            vecinos.append({
                                "label": label,
                                "id_genero": r["id_genero"]
                            })

                if not vecinos:
                    continue

                current_node = random.choice(vecinos)

                if current_node["label"] == "Book":

                    id_libro = current_node["id_libro"]

                    if id_libro not in libros_leidos:
                        visitas[id_libro] += 1

        recomendaciones = sorted(
            visitas.items(),
            key=lambda x: x[1],
            reverse=True
        )

        return recomendaciones[:10]

    def obtener_libros_leidos(self, id_usuario):

        query = """
        MATCH (u:User {
            id_usuario: $id_usuario
        })-[:LEYO]->(b:Book)

        RETURN b.id_libro AS id_libro
        """

        libros = []

        with db.driver.session() as session:

            resultado = session.run(
                query,
                id_usuario=id_usuario
            )

            for r in resultado:

                libros.append(
                    r["id_libro"]
                )

        return libros