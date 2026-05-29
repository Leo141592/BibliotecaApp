import { useState } from "react"
import MainLayout from "../layouts/MainLayout"
import { agregarAmigo, obtenerSesion } from "../services/api"

type Usuario = {
  id: string
  username: string
  favoriteGenre: string
}

function SearchFriendsPage() {

  const [search, setSearch] = useState("")
  const [agregados, setAgregados] = useState<string[]>([])
  const [errores, setErrores] = useState<Record<string, string>>({})

  //  Id del usuario logueado desde localStorage
  const { id_usuario } = obtenerSesion()

  // Estos usuarios vendrían del backend en una integración completa;
  // por ahora se mantiene la lista local pero el botón sí llama a la API
  const users: Usuario[] = [
    { id: "1", username: "Ana", favoriteGenre: "Fantasy" },
    { id: "2", username: "Carlos", favoriteGenre: "Horror" },
    { id: "3", username: "Maria", favoriteGenre: "Romance" },
    { id: "4", username: "Luis", favoriteGenre: "Sci-Fi" },
    { id: "5", username: "Sofia", favoriteGenre: "Mystery" },
  ]

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  )

  const handleAgregar = async (id_amigo: string) => {
    if (!id_usuario) return

    try {
      //  Llama al backend real
      await agregarAmigo(id_usuario, id_amigo)
      setAgregados((prev) => [...prev, id_amigo])
    } catch {
      setErrores((prev) => ({
        ...prev,
        [id_amigo]: "Error al agregar"
      }))
    }
  }

  return (

    <MainLayout>

      <h1 className="text-5xl font-bold mb-10">
        Buscar Amigos
      </h1>

      <div className="mb-10">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-2xl shadow-md bg-white outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {filteredUsers.map((user) => (

          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-md p-8 flex justify-between items-center"
          >

            <div>
              <h2 className="text-2xl font-bold mb-2">
                {user.username}
              </h2>
              <p className="text-gray-600">
                Género favorito: {user.favoriteGenre}
              </p>
              {errores[user.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {errores[user.id]}
                </p>
              )}
            </div>

            {/*  Botón conectado a la API */}
            <button
              onClick={() => handleAgregar(user.id)}
              disabled={agregados.includes(user.id)}
              className={`
                px-5 py-3 rounded-xl text-white transition
                ${agregados.includes(user.id)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"}
              `}
            >
              {agregados.includes(user.id) ? "Agregado ✓" : "Agregar"}
            </button>

          </div>

        ))}

      </div>

    </MainLayout>

  )
}

export default SearchFriendsPage
