import { useEffect, useState } from "react"
import MainLayout from "../layouts/MainLayout"
import { obtenerTodosUsuarios, agregarAmigo, obtenerSesion } from "../services/api"

type Usuario = {
  id: number
  nombre: string
  preferencia: string
  ya_es_amigo: boolean
}

function SearchFriendsPage() {

  const { id_usuario } = obtenerSesion()

  const [usuarios,  setUsuarios]  = useState<Usuario[]>([])
  const [cargando,  setCargando]  = useState(true)
  const [error,     setError]     = useState("")
  const [search,    setSearch]    = useState("")

  // Ids en proceso de agregar (para deshabilitar el botón mientras espera)
  const [agregando, setAgregando] = useState<number[]>([])
  const [errores,   setErrores]   = useState<Record<number, string>>({})

  useEffect(() => {
    if (!id_usuario) {
      setError("No hay sesión activa")
      setCargando(false)
      return
    }

    obtenerTodosUsuarios(id_usuario)
      .then(setUsuarios)
      .catch(() => setError("Error al cargar usuarios"))
      .finally(() => setCargando(false))
  }, [id_usuario])

  const handleAgregar = async (usuario: Usuario) => {
    if (!id_usuario) return

    setAgregando((prev) => [...prev, usuario.id])
    setErrores((prev) => { const e = { ...prev }; delete e[usuario.id]; return e })

    try {
      await agregarAmigo(id_usuario, String(usuario.id))

      // Marcar como amigo en el estado local para feedback inmediato
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === usuario.id ? { ...u, ya_es_amigo: true } : u
        )
      )
    } catch {
      setErrores((prev) => ({ ...prev, [usuario.id]: "Error al agregar" }))
    } finally {
      setAgregando((prev) => prev.filter((id) => id !== usuario.id))
    }
  }

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MainLayout>

      <h1 className="text-5xl font-bold mb-10">Buscar Amigos</h1>

      <div className="mb-10">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-2xl shadow-md bg-white outline-none"
        />
      </div>

      {cargando && <p className="text-gray-400">Cargando usuarios...</p>}
      {error    && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {usuariosFiltrados.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white rounded-2xl shadow-md p-8 flex justify-between items-center"
          >
            <div>
              <h2 className="text-2xl font-bold mb-1">{usuario.nombre}</h2>
              <p className="text-gray-500">
                Género favorito:{" "}
                <span className="font-semibold">{usuario.preferencia}</span>
              </p>
              {errores[usuario.id] && (
                <p className="text-red-500 text-sm mt-1">{errores[usuario.id]}</p>
              )}
            </div>

            <button
              onClick={() => handleAgregar(usuario)}
              disabled={usuario.ya_es_amigo || agregando.includes(usuario.id)}
              className={`
                px-5 py-3 rounded-xl text-white transition font-semibold
                ${usuario.ya_es_amigo
                  ? "bg-gray-300 cursor-not-allowed"
                  : agregando.includes(usuario.id)
                    ? "bg-blue-400 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {usuario.ya_es_amigo
                ? "Amigos ✓"
                : agregando.includes(usuario.id)
                  ? "Agregando..."
                  : "Agregar"}
            </button>
          </div>
        ))}
      </div>

    </MainLayout>
  )
}

export default SearchFriendsPage