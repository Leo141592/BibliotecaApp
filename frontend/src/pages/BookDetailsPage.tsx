import { useParams, useNavigate } from "react-router-dom"
import BookCard from "../components/BookCard"
import { useState } from "react"

function BookDetailsPage() {

  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
const [review, setReview] = useState("")
const [isReading, setIsReading] = useState(false)
const [isSaved, setIsSaved] = useState(false)

  const { id } = useParams()

  const suggestedBooks = [
    {
      id: 10,
      title: "Foundation",
      author: "Isaac Asimov",
      year: "1951",
      description: "Una saga sobre el colapso galáctico."
    },
    {
      id: 11,
      title: "Brave New World",
      author: "Aldous Huxley",
      year: "1932",
      description: "Una sociedad diseñada artificialmente."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

        <h1 className="text-5xl font-bold mb-4">
          Libro {id}
        </h1>

        <p className="text-xl mb-2">
          Autor: George Orwell
        </p>

        <p className="text-lg mb-6">
          Publicado en: 2020
        </p>

        <p className="text-gray-700">
          Esta será la descripción completa del libro.
          
        </p>

        {/* Botones */}
<div className="flex gap-4 justify-end mt-8">

  {/* Leer */}
  <button
    onClick={() => setIsReading(!isReading)}
    className={`
      px-6 py-3 rounded-xl text-white transition
      ${isReading
        ? "bg-red-600 hover:bg-red-700"
        : "bg-green-600 hover:bg-green-700"}
    `}
  >
    {isReading
      ? "Dejar de leer"
      : "Comenzar a leer"}
  </button>

  {/* Guardados */}
  <button
    onClick={() => setIsSaved(!isSaved)}
    className={`
      px-6 py-3 rounded-xl text-white transition
      ${isSaved
        ? "bg-red-500 hover:bg-red-600"
        : "bg-blue-600 hover:bg-blue-700"}
    `}
  >
    {isSaved
      ? "Eliminar de guardados"
      : "Guardar lectura"}
  </button>

</div>

      </div>

      <section>

        <h2 className="text-3xl font-bold mb-6">
          Libros similares sugeridos
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4">

          {suggestedBooks.map((book) => (

            <div key={book.id} className="relative">

              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                year={book.year}
                description={book.description}
              />

              <button
                className="absolute top-3 right-3 bg-blue-600 text-white w-8 h-8 rounded-full hover:bg-blue-700 transition"
              >
                +
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* Reseña */}
<section className="mt-16">

  <h2 className="text-3xl font-bold mb-6">
    Mi reseña
  </h2>

  {/* Estrellas */}
  <div className="flex gap-2 mb-6">

    {[1, 2, 3, 4, 5].map((star) => (

      <button
        key={star}
        onClick={() => setRating(star)}
        className={`
          text-4xl transition
          ${star <= rating
            ? "text-yellow-400"
            : "text-gray-300"}
        `}
      >
        ★
      </button>

    ))}

  </div>

  {/* Caja de reseña */}
  <textarea
    value={review}
    onChange={(e) => setReview(e.target.value)}
    placeholder="Escribe tu reseña..."
    className="w-full h-40 p-4 rounded-2xl border shadow-sm resize-none bg-white"
  />

  {/* Botón guardar */}
  <button
    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
  >
    Guardar reseña
  </button>

</section>

{/* Botón volver */}
<div className="flex justify-end mt-12">

  <button
    onClick={() => navigate("/home")}
    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
  >
    Volver a la biblioteca
  </button>

</div>

</div>
  )
}

export default BookDetailsPage