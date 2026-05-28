import { useState } from "react"
import MainLayout from "../layouts/MainLayout"

function SearchFriendsPage() {

  const [search, setSearch] = useState("")

  const users = [
    {
      id: 1,
      username: "Maria",
      favoriteGenre: "Fantasía"
    },
    {
      id: 2,
      username: "Carlos",
      favoriteGenre: "Ciencia ficción"
    },
    {
      id: 3,
      username: "Ana",
      favoriteGenre: "Misterio"
    },
    {
      id: 4,
      username: "Diego",
      favoriteGenre: "Cyberpunk"
    },
    {
      id: 5,
      username: "Sofia",
      favoriteGenre: "Romance"
    }
  ]

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <MainLayout>

      <h1 className="text-5xl font-bold mb-10">
        Buscar Amigos
      </h1>

      {/* Barra búsqueda */}
      <div className="mb-10">

        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-2xl shadow-md bg-white outline-none"
        />

      </div>

      {/* Usuarios */}
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

            </div>

            <button
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Agregar
            </button>

          </div>

        ))}

      </div>

    </MainLayout>

  )
}

export default SearchFriendsPage