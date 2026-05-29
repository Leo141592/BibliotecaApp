import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { obtenerRecomendaciones, obtenerSesion } from "../services/api"

type Recomendacion = {
  titulo: string
  autor: string
  genero: string
  rating: number
  year: number
  visitas: number
}

function HomePage() {

  const navigate = useNavigate()
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // Leer sesión una sola vez con useState para evitar el warning de dependencias
  const [sesion] = useState(() => obtenerSesion())
  const { nombre_usuario, id_usuario } = sesion

  useEffect(() => {
    if (!id_usuario) {
      setError("No hay sesión activa")
      setCargando(false)
      return
    }
    obtenerRecomendaciones(id_usuario)
      .then((data) => setRecomendaciones(data))
      .catch(() => setError("Error al cargar recomendaciones"))
      .finally(() => setCargando(false))
  }, [id_usuario])

  return (
    <MainLayout>

      <h1 className="text-5xl font-bold mb-2">
        Recomendaciones
      </h1>

      {nombre_usuario && (
        <p className="text-gray-500 mb-10">Hola, {nombre_usuario} 👋</p>
      )}

      {cargando && <p className="text-gray-400">Cargando recomendaciones...</p>}
      {error    && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {recomendaciones.map((libro, index) => (

          <div
            key={index}
            onClick={() => navigate(`/books/${encodeURIComponent(libro.titulo)}`)}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-1">{libro.titulo}</h2>
            <p className="text-gray-600 mb-1">{libro.autor}</p>
            <p className="text-gray-400 text-sm mb-3">{libro.genero} · {libro.year}</p>

            <div className="flex justify-between items-center">
              <span className="text-yellow-500 font-semibold">
                ★ {libro.rating}
              </span>
              <span className="text-xs text-gray-400">
                {libro.visitas} visitas
              </span>
            </div>

          </div>

        ))}

      </div>

    </MainLayout>
  )
}

export default HomePage