import { useNavigate } from "react-router-dom"

function Sidebar() {

  const navigate = useNavigate()

  return (

    <div className="w-64 min-w-[16rem] bg-white shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-8">
        Menú
      </h2>

      <div className="flex flex-col gap-4">

        <button
            onClick={() => navigate("/account")}
          className="text-left hover:text-blue-600 transition cursor-pointer"
        >
          Cuenta
        </button>

        <button
          onClick={() => navigate("/home")}
          className="text-left hover:text-blue-600 transition cursor-pointer"
        >
          Biblioteca
        </button>

        <button
          onClick={() => navigate("/explore")}
          className="text-left hover:text-blue-600 transition cursor-pointer"
        >
          Explorar
        </button>

        <button
  onClick={() => navigate("/friends")}
  className="text-left hover:text-blue-600 transition cursor-pointer"
>
  Amigos
</button>

<button
  onClick={() => navigate("/search-friends")}
  className="text-left hover:text-blue-600 transition cursor-pointer"
>
  Buscar amigos
</button>

      </div>

    </div>

  )
}

export default Sidebar