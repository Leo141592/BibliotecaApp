import MainLayout from "../layouts/MainLayout"
import { useEffect, useState } from "react"
import BookCard from "../components/BookCard"
import {
  obtenerSesion,
  cerrarSesion,
  obtenerEstadisticas,
  obtenerFavoritos
} from "../services/api"

type Estadisticas = {
  libros_leidos: number
  autor_mas_leido: string
  genero_mas_leido: string
}

type Libro = {
  titulo: string
  autor: string
  genero: string
  rating: number
  year: number
}

function AccountPage() {

  const { id_usuario, nombre_usuario } = obtenerSesion()

  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    libros_leidos: 0,
    autor_mas_leido: "—",
    genero_mas_leido: "—"
  })

  const [favoritos, setFavoritos] = useState<Libro[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!id_usuario) {
      setCargando(false)
      return
    }

    Promise.all([
      obtenerEstadisticas(id_usuario),
      obtenerFavoritos(id_usuario)
    ])
      .then(([stats, favs]) => {
        setEstadisticas(stats)
        setFavoritos(favs)
      })
      .catch(console.error)
      .finally(() => setCargando(false))

  }, [id_usuario])

  const handleLogout = () => {
    cerrarSesion()
    // Reload completo igual que el login
    window.location.href = "/"
  }

  return (

    <MainLayout>

      <h1 className="text-5xl font-bold mb-10">
        Mi Cuenta
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
        <h2 className="text-3xl font-bold mb-2">
          {nombre_usuario ?? "Usuario"}
        </h2>
        <p className="text-gray-600">Usuario de Biblioteca</p>
      </div>

      {cargando ? (

        <p className="text-gray-400 mb-16">Cargando estadísticas...</p>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-500">Libros leídos</h3>
            <p className="text-5xl font-bold">{estadisticas.libros_leidos}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-500">Género más leído</h3>
            <p className="text-2xl font-bold">{estadisticas.genero_mas_leido}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-500">Autor más leído</h3>
            <p className="text-2xl font-bold">{estadisticas.autor_mas_leido}</p>
          </div>

        </div>

      )}

      <section className="mb-16">

        <h2 className="text-3xl font-bold mb-6">Libros favoritos</h2>

        {cargando ? (

          <p className="text-gray-400">Cargando favoritos...</p>

        ) : favoritos.length === 0 ? (

          <p className="text-gray-400">Aún no has agregado libros a favoritos.</p>

        ) : (

          <div className="flex gap-6 overflow-x-auto pb-4">
            {favoritos.map((libro) => (
              <BookCard
                key={libro.titulo}
                id={libro.titulo}
                title={libro.titulo}
                author={libro.autor}
                year={String(libro.year)}
                description={`${libro.genero} · ★ ${libro.rating}`}
              />
            ))}
          </div>

        )}

      </section>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>

    </MainLayout>

  )
}

export default AccountPage