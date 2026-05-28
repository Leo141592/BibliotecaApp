import MainLayout from "../layouts/MainLayout"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import BookCard from "../components/BookCard"

function AccountPage() {

  const navigate = useNavigate()

  const [favoriteGenre, setFavoriteGenre] = useState("Ciencia ficción")

  const [favoriteAuthor, setFavoriteAuthor] = useState("Isaac Asimov")

  const favoriteBooks = [
    {
      id: 101,
      title: "Dune",
      author: "Frank Herbert",
      year: "1965",
      description: "Política y guerra en Arrakis."
    },
    {
      id: 102,
      title: "Foundation",
      author: "Isaac Asimov",
      year: "1951",
      description: "La caída del Imperio Galáctico."
    },
    {
      id: 103,
      title: "Neuromancer",
      author: "William Gibson",
      year: "1984",
      description: "Cyberpunk y hackers futuristas."
    }
  ]

  return (

    <MainLayout>

      <h1 className="text-5xl font-bold mb-10">
        Mi Cuenta
      </h1>

      {/* Información usuario */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-10">

        <h2 className="text-3xl font-bold mb-2">
          admin
        </h2>

        <p className="text-gray-600">
          Usuario de Biblioteca
        </p>

      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">

        {/* Libros leídos */}
        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-xl font-semibold mb-2">
            Libros leídos
          </h3>

          <p className="text-5xl font-bold">
            24
          </p>

        </div>

        {/* Género más leído */}
        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-xl font-semibold mb-2">
            Género más leído
          </h3>

          <p className="text-2xl font-bold">
            Fantasía
          </p>

        </div>

        {/* Género favorito */}
        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-xl font-semibold mb-4">
            Género favorito
          </h3>

          <select
            value={favoriteGenre}
            onChange={(e) => setFavoriteGenre(e.target.value)}
            className="w-full p-3 rounded-xl border"
          >
            <option>Ciencia ficción</option>
            <option>Fantasía</option>
            <option>Misterio</option>
            <option>Romance</option>
            <option>Terror</option>
            <option>Aventura</option>
          </select>

        </div>

        {/* Autor más leído */}
<div className="bg-white rounded-2xl shadow-md p-6">

  <h3 className="text-xl font-semibold mb-2">
    Autor más leído
  </h3>

  <p className="text-xl font-bold">
    Frank Herbert
  </p>

</div>

{/* Autor favorito */}
<div className="bg-white rounded-2xl shadow-md p-6">

  <h3 className="text-xl font-semibold mb-4">
    Autor favorito
  </h3>

  <select
    value={favoriteAuthor}
    onChange={(e) => setFavoriteAuthor(e.target.value)}
    className="w-full p-3 rounded-xl border"
  >
    <option>Isaac Asimov</option>
    <option>Frank Herbert</option>
    <option>George Orwell</option>
    <option>J.R.R. Tolkien</option>
    <option>William Gibson</option>
  </select>

</div>

      </div>

      {/* Libros favoritos */}
      <section className="mb-16">

        <h2 className="text-3xl font-bold mb-6">
          Libros favoritos
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4">

          {favoriteBooks.map((book) => (

            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              year={book.year}
              description={book.description}
            />

          ))}

        </div>

      </section>

      {/* Botón logout */}
      <button
        onClick={() => navigate("/")}
        className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>

    </MainLayout>

  )
}

export default AccountPage