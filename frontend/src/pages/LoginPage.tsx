import { useState } from "react"
import { Link } from "react-router-dom"
import { iniciarSesion, guardarSesion } from "../services/api"

function LoginPage() {

  const [nombre,      setNombre]      = useState("")
  const [contrasenia, setContrasenia] = useState("")
  const [error,       setError]       = useState("")
  const [cargando,    setCargando]    = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    try {
      const data = await iniciarSesion(nombre, contrasenia)
      guardarSesion(data.token, data.id_usuario, data.nombre_usuario)
      window.location.href = "/home"

    } catch {
      setError("Nombre o contraseña incorrectos")
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Iniciar Sesión
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Nombre de usuario
            </label>
            <input
              type="text"
              placeholder="Tu nombre"
              className="border p-3 rounded-lg w-full"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Tu contraseña"
              className="border p-3 rounded-lg w-full"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {cargando ? "Entrando..." : "Entrar"}
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
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