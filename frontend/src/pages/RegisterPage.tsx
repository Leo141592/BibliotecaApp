import { Link } from "react-router-dom"
import { useState } from "react"

function RegisterPage() {

  const [accountCreated, setAccountCreated] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Crear Cuenta
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setAccountCreated(true)
          }}
        >

          <input
            type="text"
            placeholder="Nombre de usuario"
            className="border p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            Crear Cuenta
          </button>

          {accountCreated && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center">
              Cuenta creada con éxito
            </div>
          )}

        </form>

        <p className="text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/"
            className="text-blue-600 hover:underline"
          >
            Volver al login
          </Link>
        </p>

      </div>

    </div>
  )
}

export default RegisterPage