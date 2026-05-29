from app.algoritmo.randomwalk import Randomwalk


class ServicioRecomendacion:

    @staticmethod
    def obtenerRecomendaciones(id_usuario):

        recomendador = Randomwalk()

        return recomendador.recomendar(id_usuario)