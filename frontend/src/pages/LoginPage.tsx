import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function LoginPage() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Iniciar Sesión
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()

            if (username === "admin" && password === "1234") {
              navigate("/home")
            } else {
              setError("Usuario o contraseña incorrectos")
            }
          }}
        >

          <input
            type="text"
            placeholder="Nombre de usuario"
            className="border p-3 rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Entrar
          </button>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

        </form>

        <p className="text-center mt-4">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Crear cuenta
          </Link>
        </p>

      </div>

    </div>
  )
}

export default LoginPage