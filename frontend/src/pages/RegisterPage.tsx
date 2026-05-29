import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registrarUsuario } from "../services/api"

function RegisterPage() {

  const navigate = useNavigate()

  const [nombreUsuario, setNombreUsuario] = useState("")
  const [correo, setCorreo] = useState("")
  const [contrasenia, setContrasenia] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)

    try {
      //  Llama al backend real
      await registrarUsuario(nombreUsuario, correo, contrasenia)

      // Redirige al login tras registrarse
      navigate("/")

    } catch {
      setError("Error al crear la cuenta. Intenta de nuevo.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Crear Cuenta
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleRegistro}>

          <input
            type="text"
            placeholder="Nombre de usuario"
            className="border p-3 rounded-lg"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            className="border p-3 rounded-lg"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="border p-3 rounded-lg"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={cargando}
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {cargando ? "Creando cuenta..." : "Crear Cuenta"}
          </button>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

        </form>

        <p className="text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Volver al login
          </Link>
        </p>

      </div>

    </div>
  )
}

export default RegisterPage
