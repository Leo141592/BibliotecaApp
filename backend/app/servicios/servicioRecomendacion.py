from app.algoritmo.randomwalk import Randomwalk

class ServicioRecomendacion:

    @staticmethod
    def obtenerRecomendaciones(id_usuario):

        print("Usuario recibido:", id_usuario)

        recomendador = Randomwalk()

        recomendaciones = recomendador.recomendar(id_usuario)

        print("Recomendaciones:", recomendaciones)

        return recomendaciones