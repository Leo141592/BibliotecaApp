const API_URL = "http://127.0.0.1:8000"

export async function obtenerRecomendaciones(idUsuario: string) {

  const response = await fetch(
    `${API_URL}/usuario/${idUsuario}`
  )

  if (!response.ok) {
    throw new Error("Error obteniendo recomendaciones")
  }

  return response.json()
}