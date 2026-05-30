from neo4j import GraphDatabase
import pandas as pd

# conexión Neo4j
uri = "neo4j+s://59125830.databases.neo4j.io"
user = "59125830"
password = "1B_UkrRVc4GIxOhv_VN5XbpG43GnJiIbxv2xwBEzdcE"

driver = GraphDatabase.driver(uri, auth=(user, password))

# cargar CSV
books = pd.read_csv("books_database.csv")
users = pd.read_csv("users_database.csv")
interactions = pd.read_csv("interactions_database.csv")

with driver.session(database="59125830") as session:

    # limpiar base
    session.run("MATCH (n) DETACH DELETE n")

    # =========================
    # CREAR LIBROS
    # =========================

    for _, row in books.iterrows():

        session.run(
            """
            CREATE (:Libro {
                titulo:$titulo,
                autor:$autor,
                genero:$genero,
                rating:$rating,
                year:$year
            })
            """,

            titulo=row["name"],
            autor=row["author"],
            genero=row["genre"],
            rating=float(row["rating"]),
            year=int(row["year"])
        )

    print("Libros cargados")

    # =========================
    # CREAR GENEROS
    # =========================

    genres = books["genre"].dropna().unique()

    for genre in genres:

        session.run(
            """
            MERGE (:Genero {nombre:$nombre})
            """,

            nombre=genre
        )

    print("Generos cargados")

    # =========================
    # RELACION LIBRO-GENERO
    # =========================

    session.run(
        """
        MATCH (l:Libro),(g:Genero)
        WHERE l.genero = g.nombre
        MERGE (l)-[:PERTENECE_A]->(g)
        """
    )

    print("Relaciones libro-genero creadas")

    # =========================
    # CREAR USUARIOS
    # =========================

    for _, row in users.iterrows():

        session.run(
            """
            CREATE (:Usuario {
                id:$id,
                nombre:$nombre,
                edad:$edad,
                preferencia:$preferencia
            })
            """,

            id=int(row["id_usuario"]),
            nombre=row["nombre"],
            edad=int(row["edad"]),
            preferencia=row["preferencia"]
        )

    print("Usuarios cargados")

    # =========================
    # INTERACCIONES
    # =========================

    for _, row in interactions.iterrows():

        session.run(
            """
            MATCH (u:Usuario {id:$id}),
                  (l:Libro {titulo:$titulo})

            MERGE (u)-[:LEYO {
                puntuacion:$puntuacion
            }]->(l)
            """,

            id=int(row["id_usuario"]),
            titulo=row["libro"],
            puntuacion=float(row["puntuacion"])
        )

    print("Interacciones creadas")

    # =========================
    # LIBROS SIMILARES
    # =========================

    session.run(
        """
        MATCH (a:Libro),(b:Libro)

        WHERE a.genero = b.genero
        AND a <> b

        MERGE (a)-[:SIMILAR_A]->(b)
        """
    )

    print("Relaciones SIMILAR_A creadas")

driver.close()

print("Base de datos cargada correctamente")
