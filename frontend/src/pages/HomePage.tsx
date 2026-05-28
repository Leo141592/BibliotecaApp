import BookCard from "../components/BookCard"
import { useEffect, useState } from "react"
import { obtenerRecomendaciones } from "../services/api"
import MainLayout from "../layouts/MainLayout"

function HomePage() {

  const [recomendaciones, setRecomendaciones] = useState<any[]>([])

  useEffect(() => {

  obtenerRecomendaciones("1")
    .then((data) => {
      console.log(data)
      setRecomendaciones(data)
    })
    .catch((error) => {
      console.error(error)
    })

}, [])
    

const books = [
  {
    id: 1,
    title: "1984",
    author: "George Orwell",
    year: "1949",
    description: "Una distopía sobre vigilancia y control."
  },
  {
    id: 2,
    title: "Dune",
    author: "Frank Herbert",
    year: "1965",
    description: "Política, religión y guerra en Arrakis."
  },
  {
    id: 3,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: "1937",
    description: "La aventura de Bilbo Bolsón."
  }
]

  return (

  <MainLayout>

    <h1 className="text-5xl font-bold mb-10">
      Biblioteca
    </h1>

    {/* Lecturas en proceso */}
    <section className="mb-10">

      <h2 className="text-2xl font-semibold mb-4">
        Lecturas en proceso
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-2">
        {books.map((book, index) => (
          <BookCard
            key={index}
            id={book.id}
            title={book.title}
            author={book.author}
            year={book.year}
            description={book.description}
          />
        ))}
      </div>

    </section>

    {/* Lecturas guardadas */}
    <section className="mb-10">

      <h2 className="text-2xl font-semibold mb-4">
        Lecturas guardadas
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-2">
        {books.map((book, index) => (
          <BookCard
            key={index}
            id={book.id}
            title={book.title}
            author={book.author}
            year={book.year}
            description={book.description}
          />
        ))}
      </div>

    </section>

    {/* Lecturas terminadas */}
    <section>

      <h2 className="text-2xl font-semibold mb-4">
        Lecturas terminadas
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-2">
        {books.map((book, index) => (
          <BookCard
            key={index}
            id={book.id}
            title={book.title}
            author={book.author}
            year={book.year}
            description={book.description}
          />
        ))}
      </div>

    </section>

  </MainLayout>

)
}

export default HomePage