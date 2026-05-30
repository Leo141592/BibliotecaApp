import { useEffect, useState } from "react"
import MainLayout from "../layouts/MainLayout"
import { obtenerAmigos, obtenerSesion } from "../services/api"

type Amigo = {
  id: number
  nombre: string
  libros_leidos: number
  genero_favorito: string
  autor_favorito: string
}

function FriendsPage() {

  const { id_usuario } = obtenerSesion()

  const [amigos,   setAmigos]   = useState<Amigo[]>([])
  const [cargando, setCargando] = useState(true)
  const [error,    setError]    = useState("")

  useEffect(() => {
    if (!id_usuario) {
      setError("No hay sesión activa")
      setCargando(false)
      return
    }

    obtenerAmigos(id_usuario)
      .then(setAmigos)
      .catch(() => setError("Error al cargar amigos"))
      .finally(() => setCargando(false))
  }, [id_usuario])

  return (
    <MainLayout>

      <h1 className="text-5xl font-bold mb-10">Amigos</h1>

      {cargando && (
        <p className="text-gray-400">Cargando amigos...</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!cargando && !error && amigos.length === 0 && (
        <p className="text-gray-400">
          Aún no tienes amigos agregados. ¡Ve a{" "}
          <span className="text-blue-600 font-semibold">Buscar amigos</span>{" "}
          para agregar!
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {amigos.map((amigo) => (
          <div
            key={amigo.id}
            className="bg-white rounded-2xl shadow-md p-8"
          >
            <h2 className="text-3xl font-bold mb-6">{amigo.nombre}</h2>

            <div className="flex flex-col gap-4">

              <div>
                <p className="text-gray-500">Libros leídos</p>
                <p className="text-2xl font-bold">{amigo.libros_leidos}</p>
              </div>

              <div>
                <p className="text-gray-500">Género favorito</p>
                <p className="text-2xl font-bold">{amigo.genero_favorito}</p>
              </div>

              <div>
                <p className="text-gray-500">Autor favorito</p>
                <p className="text-2xl font-bold">{amigo.autor_favorito}</p>
              </div>

            </div>
          </div>
        ))}
      </div>

    </MainLayout>
  )
}

export default FriendsPage