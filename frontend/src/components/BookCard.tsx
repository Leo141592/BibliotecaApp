import { Link } from "react-router-dom"

type BookCardProps = {
  id: string | number   // acepta titulo (string) o id numérico
  title: string
  author: string
  year: string
  description: string
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

function BookCard({
  id,
  title,
  author,
  year,
  description,
  isFavorite = false,
  onToggleFavorite
}: BookCardProps) {

  return (

    <div className="relative">

      <button
        onClick={onToggleFavorite}
        className={`
          absolute -top-2 -left-2 z-10
          w-10 h-10 rounded-full
          text-white font-bold text-xl
          transition
          ${isFavorite
            ? "bg-red-500 hover:bg-red-600"
            : "bg-yellow-400 hover:bg-yellow-500"}
        `}
      >
        {isFavorite ? "−" : "★"}
      </button>

      <Link to={`/books/${encodeURIComponent(String(id))}`}>

        <div className="bg-white rounded-2xl shadow-md p-4 min-w-62.5 hover:scale-105 transition cursor-pointer">

          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-600">{author}</p>
          <p className="text-gray-500 text-sm mb-2">{year}</p>
          <p className="text-sm text-gray-700">{description}</p>

        </div>

      </Link>

    </div>

  )
}

export default BookCard