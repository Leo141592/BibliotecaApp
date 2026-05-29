import { useEffect, useState, useCallback } from "react"
import BookCard from "../components/BookCard"
import MainLayout from "../layouts/MainLayout"
import { buscarLibros, marcarFavorito, obtenerSesion } from "../services/api"

// Géneros que existen en la DB — ajusta si agregas más
const GENEROS = ["Fiction", "Non Fiction", "Childrens"]

type Libro = {
  titulo: string
  autor: string
  genero: string
  rating: number
  year: number
}

function ExplorePage() {

  const { id_usuario } = obtenerSesion()

  // ── Filtros ──────────────────────────────────────────────────────
  const [search,      setSearch]      = useState("")
  const [generoFiltro, setGeneroFiltro] = useState("")

  // ── Resultados ───────────────────────────────────────────────────
  const [libros,    setLibros]    = useState<Libro[]>([])
  const [cargando,  setCargando]  = useState(false)
  const [error,     setError]     = useState("")

  // ── Favoritos locales (optimistic UI) ───────────────────────────
  const [favoritos, setFavoritos] = useState<string[]>([])

  // ── Búsqueda ─────────────────────────────────────────────────────
  // Se ejecuta al montar y cada vez que cambia el filtro de género.
  // La búsqueda por texto usa debounce manual con useEffect + timeout.
  const fetchLibros = useCallback(
    async (searchValue: string, genero: string) => {
      setCargando(true)
      setError("")
      try {
        const data = await buscarLibros({
          search: searchValue || undefined,
          genero: genero     || undefined,
          limit: 50
        })
        setLibros(data)
      } catch {
        setError("Error al cargar libros")
      } finally {
        setCargando(false)
      }
    },
    []
  )

  // Carga inicial y al cambiar género (inmediato)
  useEffect(() => {
    fetchLibros(search, generoFiltro)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generoFiltro])

  // Debounce para el campo de texto (espera 400 ms tras dejar de escribir)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLibros(search, generoFiltro)
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // ── Toggle favorito ───────────────────────────────────────────────
  const toggleFavorito = async (titulo: string) => {
    if (!id_usuario) return

    // Optimistic: marca visualmente de inmediato
    setFavoritos((prev) =>
      prev.includes(titulo)
        ? prev.filter((t) => t !== titulo)
        : [...prev, titulo]
    )

    try {
      await marcarFavorito(id_usuario, titulo)
    } catch {
      // Revertir si falla
      setFavoritos((prev) =>
        prev.includes(titulo)
          ? prev.filter((t) => t !== titulo)
          : [...prev, titulo]
      )
    }
  }

  return (
    <MainLayout>

      <h1 className="text-5xl font-bold mb-8">Explorar</h1>

      {/* ── Filtros ── */}
      <div className="mb-10 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-4 rounded-2xl shadow-md bg-white outline-none"
        />

        <select
          value={generoFiltro}
          onChange={(e) => setGeneroFiltro(e.target.value)}
          className="p-4 rounded-2xl shadow-md bg-white"
        >
          <option value="">Todos los géneros</option>
          {GENEROS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

      </div>

      {/* ── Estado ── */}
      {cargando && (
        <p className="text-gray-400 mb-6">Buscando libros...</p>
      )}
      {error && (
        <p className="text-red-500 mb-6">{error}</p>
      )}
      {!cargando && !error && libros.length === 0 && (
        <p className="text-gray-400 mb-6">No se encontraron libros.</p>
      )}

      {/* ── Grid de resultados ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {libros.map((libro) => (
          <BookCard
            key={libro.titulo}
            id={libro.titulo}
            title={libro.titulo}
            author={libro.autor}
            year={String(libro.year)}
            description={`★ ${libro.rating}`}
            isFavorite={favoritos.includes(libro.titulo)}
            onToggleFavorite={() => toggleFavorito(libro.titulo)}
          />
        ))}
      </div>

    </MainLayout>
  )
}

export default ExplorePage