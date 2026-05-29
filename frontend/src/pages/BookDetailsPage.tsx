import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  obtenerLibro,
  marcarLeido,
  marcarFavorito,
  obtenerSesion
} from "../services/api"

type Libro = {
  titulo: string
  autor: string
  genero: string
  rating: number
  year: number
}

function BookDetailsPage() {

  const { id } = useParams()            // id = titulo codificado en la URL
  const navigate = useNavigate()
  const { id_usuario } = obtenerSesion()

  const titulo = decodeURIComponent(id ?? "")

  // ── Estado del libro ────────────────────────────────────────────
  const [libro, setLibro] = useState<Libro | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // ── Estado interacciones ────────────────────────────────────────
  const [puntuacion, setPuntuacion] = useState(0)
  const [guardandoLeido, setGuardandoLeido] = useState(false)
  const [guardandoFav, setGuardandoFav] = useState(false)
  const [mensajeLeido, setMensajeLeido] = useState("")
  const [mensajeFav, setMensajeFav] = useState("")

  // ── Carga datos del libro ───────────────────────────────────────
  useEffect(() => {
    if (!titulo) return
    obtenerLibro(titulo)
      .then((data) => setLibro(data))
      .catch(() => setError("Libro no encontrado"))
      .finally(() => setCargando(false))
  }, [titulo])

  // ── Marcar como leído ───────────────────────────────────────────
  const handleMarcarLeido = async () => {
    if (!id_usuario || puntuacion === 0) return
    setGuardandoLeido(true)
    try {
      await marcarLeido(id_usuario, titulo, puntuacion)
      setMensajeLeido(`✓ Guardado con puntuación ${puntuacion}/10`)
    } catch {
      setMensajeLeido("Error al guardar")
    } finally {
      setGuardandoLeido(false)
    }
  }

  // ── Marcar como favorito ────────────────────────────────────────
  const handleMarcarFavorito = async () => {
    if (!id_usuario) return
    setGuardandoFav(true)
    try {
      await marcarFavorito(id_usuario, titulo)
      setMensajeFav("✓ Agregado a favoritos")
    } catch {
      setMensajeFav("Error al guardar")
    } finally {
      setGuardandoFav(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────
  if (cargando) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400 text-xl">Cargando libro...</p>
    </div>
  )

  if (error || !libro) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-red-500 text-xl">{error || "Libro no encontrado"}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8 max-w-3xl mx-auto">

      {/* ── Datos del libro ── */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h1 className="text-4xl font-bold mb-2">{libro.titulo}</h1>
        <p className="text-xl text-gray-600 mb-1">{libro.autor}</p>
        <p className="text-gray-400 mb-4">{libro.genero} · {libro.year}</p>

        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-2xl">★</span>
          <span className="text-2xl font-bold">{libro.rating}</span>
          <span className="text-gray-400">/ 10</span>
        </div>

      </div>

      {/* ── Marcar como leído + puntuación ── */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-bold mb-4">¿Ya lo leíste?</h2>

        <p className="text-gray-500 mb-4">Dale una puntuación del 1 al 10:</p>

        {/* Selector de puntuación */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <button
              key={n}
              onClick={() => setPuntuacion(n)}
              className={`
                w-10 h-10 rounded-full font-bold transition
                ${puntuacion === n
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
              `}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          onClick={handleMarcarLeido}
          disabled={puntuacion === 0 || guardandoLeido}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-40"
        >
          {guardandoLeido ? "Guardando..." : "Marcar como leído"}
        </button>

        {mensajeLeido && (
          <p className="mt-3 text-green-600 font-semibold">{mensajeLeido}</p>
        )}

        {puntuacion === 0 && (
          <p className="mt-2 text-gray-400 text-sm">
            Selecciona una puntuación primero
          </p>
        )}

      </div>

      {/* ── Marcar como favorito ── */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-bold mb-4">¿Te encantó?</h2>

        <button
          onClick={handleMarcarFavorito}
          disabled={guardandoFav}
          className="bg-yellow-400 text-white px-6 py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-40"
        >
          {guardandoFav ? "Guardando..." : "★ Agregar a favoritos"}
        </button>

        {mensajeFav && (
          <p className="mt-3 text-yellow-600 font-semibold">{mensajeFav}</p>
        )}

      </div>

      {/* ── Volver ── */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          ← Volver a recomendaciones
        </button>
      </div>

    </div>
  )
}

export default BookDetailsPage
