import { useState } from "react"
import { Link } from "react-router-dom"
import { registrarUsuario, iniciarSesion, guardarSesion } from "../services/api"

function RegisterPage() {

  const [nombre,      setNombre]      = useState("")
  const [contrasenia, setContrasenia] = useState("")
  const [confirmar,   setConfirmar]   = useState("")
  const [error,       setError]       = useState("")
  const [cargando,    setCargando]    = useState(false)

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (contrasenia !== confirmar) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (contrasenia.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres")
      return
    }

    setCargando(true)

    try {
      // 1. Crear usuario
      const data = await registrarUsuario(nombre, contrasenia)

      // 2. Login automático con el nombre y contraseña recién creados
      const sesion = await iniciarSesion(nombre, contrasenia)
      guardarSesion(sesion.token, sesion.id_usuario, sesion.nombre_usuario)

      // 3. Redirigir al home
      window.location.href = "/home"

    } catch (err: any) {
      // El backend devuelve 409 si el nombre ya existe
      if (err?.message?.includes("409") || err?.message?.includes("uso")) {
        setError("Ese nombre de usuario ya está en uso")
      } else {
        setError("Error al crear la cuenta. Intenta de nuevo.")
      }
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
              minLength={2}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 4 caracteres"
              className="border p-3 rounded-lg w-full"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              className="border p-3 rounded-lg w-full"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
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
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
          >
            {cargando ? "Creando cuenta..." : "Crear Cuenta"}
          </button>

        </form>

        <p className="text-center mt-4 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>

      </div>

    </div>
  )
}

export default RegisterPage