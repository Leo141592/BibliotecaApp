import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { iniciarSesion, guardarSesion } from "../services/api"

// Usuarios del CSV — login temporal por id
const USUARIOS = [
  { id: 1,  nombre: "Ana",     preferencia: "Fantasy"   },
  { id: 2,  nombre: "Carlos",  preferencia: "Horror"    },
  { id: 3,  nombre: "Maria",   preferencia: "Romance"   },
  { id: 4,  nombre: "Luis",    preferencia: "Sci-Fi"    },
  { id: 5,  nombre: "Sofia",   preferencia: "Mystery"   },
  { id: 6,  nombre: "Daniel",  preferencia: "Fantasy"   },
  { id: 7,  nombre: "Valeria", preferencia: "Drama"     },
  { id: 8,  nombre: "Jose",    preferencia: "Thriller"  },
  { id: 9,  nombre: "Camila",  preferencia: "Adventure" },
  { id: 10, nombre: "Andres",  preferencia: "Fantasy"   },
]

function LoginPage() {

  const navigate = useNavigate()

  const [idSeleccionado, setIdSeleccionado] = useState<number>(1)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    try {
      //  Manda solo el id al backend
      const data = await iniciarSesion(idSeleccionado)

      //  Guarda sesión en localStorage
      guardarSesion(data.token, data.id_usuario, data.nombre_usuario)

      navigate("/home")

    } catch {
      setError("Usuario no encontrado")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-2">
          Iniciar Sesión
        </h1>

        <p className="text-center text-gray-400 text-sm mb-6">
          (Modo prueba — selecciona un usuario)
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>

          <select
            value={idSeleccionado}
            onChange={(e) => setIdSeleccionado(Number(e.target.value))}
            className="border p-3 rounded-lg bg-white"
          >
            {USUARIOS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} — {u.preferencia}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {cargando ? "Entrando..." : "Entrar"}
          </button>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

        </form>

        <p className="text-center mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Crear cuenta
          </Link>
        </p>

      </div>

    </div>
  )
}

export default LoginPage
