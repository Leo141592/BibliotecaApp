import BookCard from "../components/BookCard"
import { useState } from "react"
import MainLayout from "../layouts/MainLayout"

function ExplorePage() {

  const books = [
    {
      id: 1,
      title: "1984",
      author: "George Orwell",
      year: "1949",
      description: "Una distopía sobre vigilancia y control.",
      genre: "Distopía",
    },
    {
      id: 2,
      title: "Dune",
      author: "Frank Herbert",
      year: "1965",
      description: "Política, religión y guerra en Arrakis.",
      genre: "Ciencia ficción",
    },
    {
      id: 3,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      year: "1937",
      description: "La aventura de Bilbo Bolsón.",
      genre: "Fantasía",
    },
    {
      id: 4,
      title: "Foundation",
      author: "Isaac Asimov",
      year: "1951",
      description: "La caída del Imperio Galáctico.",
      genre: "Ciencia ficción",
    },
    {
      id: 5,
      title: "Fahrenheit 451",
      author: "Ray Bradbury",
      year: "1953",
      description: "Un mundo donde los libros están prohibidos.",
      genre: "Distopía"
    },
    {
      id: 6,
      title: "Neuromancer",
      author: "William Gibson",
      year: "1984",
      description: "Cyberpunk y hackers en el futuro.",
      genre: "Ciencia ficción"
    }
  ]

  const [search, setSearch] = useState("")
const [authorFilter, setAuthorFilter] = useState("")
const [genreFilter, setGenreFilter] = useState("")

const filteredBooks = books.filter((book) => {

  const matchesSearch =
    book.title.toLowerCase().includes(search.toLowerCase())

  const matchesAuthor =
    authorFilter === "" ||
    book.author === authorFilter

  const matchesGenre =
    genreFilter === "" ||
    book.genre === genreFilter

  return matchesSearch && matchesAuthor && matchesGenre

})

  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {

  if (favorites.includes(id)) {
    setFavorites(favorites.filter(bookId => bookId !== id))
  } else {
    setFavorites([...favorites, id])
  }

}

  return (

    <MainLayout>

      <h1 className="text-5xl font-bold mb-8">
        Explorar
      </h1>

      {/* Barra búsqueda */}
      <div className="mb-10 flex flex-col md:flex-row gap-4">

  {/* Buscar */}
  <input
    type="text"
    placeholder="Buscar libros..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 p-4 rounded-2xl shadow-md bg-white outline-none"
  />

  {/* Filtro autor */}
  <select
    value={authorFilter}
    onChange={(e) => setAuthorFilter(e.target.value)}
    className="p-4 rounded-2xl shadow-md bg-white"
  >
    <option value="">Todos los autores</option>
    <option>George Orwell</option>
    <option>Frank Herbert</option>
    <option>J.R.R. Tolkien</option>
    <option>Isaac Asimov</option>
    <option>Ray Bradbury</option>
    <option>William Gibson</option>
  </select>

  {/* Filtro género */}
  <select
    value={genreFilter}
    onChange={(e) => setGenreFilter(e.target.value)}
    className="p-4 rounded-2xl shadow-md bg-white"
  >
    <option value="">Todos los géneros</option>
    <option>Distopía</option>
    <option>Ciencia ficción</option>
    <option>Fantasía</option>
    <option>Cyberpunk</option>
  </select>

</div>

      {/* Grid libros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredBooks.map((book) => (

          <div
            key={book.id}
            className="relative"
          >

            <BookCard
              id={book.id}
              title={book.title}
              author={book.author}
              year={book.year}
              description={book.description}
              isFavorite={favorites.includes(book.id)}
              onToggleFavorite={() => toggleFavorite(book.id)}
            />

            <button
              className="absolute top-3 right-3 bg-blue-600 text-white w-8 h-8 rounded-full hover:bg-blue-700 transition"
            >
              +
            </button>

          </div>

        ))}

      </div>

    </MainLayout>

  )
}

export default ExplorePage