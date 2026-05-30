const API_URL = "http://127.0.0.1:8000"

// ── Auth ────────────────────────────────────────────────────────────

export async function iniciarSesion(nombre: string, contrasenia: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, contrasenia })
  })
  if (!response.ok) throw new Error(`${response.status}`)
  return response.json()
}

export async function registrarUsuario(nombre: string, contrasenia: string) {
  const response = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, contrasenia })
  })
  // Propagar el status para distinguir 409 (nombre en uso) en el frontend
  if (!response.ok) throw new Error(`${response.status}`)
  return response.json()
}

// ── Sesión (localStorage) ───────────────────────────────────────────

export function guardarSesion(token: string, id_usuario: string, nombre_usuario: string) {
  localStorage.setItem("token", token)
  localStorage.setItem("id_usuario", id_usuario)
  localStorage.setItem("nombre_usuario", nombre_usuario)
}

export function obtenerSesion() {
  return {
    token:          localStorage.getItem("token"),
    id_usuario:     localStorage.getItem("id_usuario"),
    nombre_usuario: localStorage.getItem("nombre_usuario")
  }
}

export function cerrarSesion() {
  localStorage.removeItem("token")
  localStorage.removeItem("id_usuario")
  localStorage.removeItem("nombre_usuario")
}

// ── Recomendaciones ─────────────────────────────────────────────────

export async function obtenerRecomendaciones(idUsuario: string) {
  const response = await fetch(`${API_URL}/usuario/${idUsuario}`)
  if (!response.ok) throw new Error("Error obteniendo recomendaciones")
  return response.json()
}

// ── Libros ──────────────────────────────────────────────────────────

export async function buscarLibros(params: {
  search?: string
  autor?: string
  genero?: string
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.autor)  query.set("autor",  params.autor)
  if (params.genero) query.set("genero", params.genero)
  if (params.limit)  query.set("limit",  String(params.limit))

  const response = await fetch(`${API_URL}/libros/buscar?${query.toString()}`)
  if (!response.ok) throw new Error("Error buscando libros")
  return response.json()
}

export async function obtenerLibro(titulo: string) {
  const response = await fetch(
    `${API_URL}/libro/${encodeURIComponent(titulo)}`
  )
  if (!response.ok) throw new Error("Libro no encontrado")
  return response.json()
}

export async function marcarLeido(
  id_usuario: string,
  titulo: string,
  puntuacion: number
) {
  const response = await fetch(`${API_URL}/libro-leido`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario, titulo, puntuacion })
  })
  if (!response.ok) throw new Error("Error al marcar libro como leído")
  return response.json()
}

export async function marcarFavorito(id_usuario: string, titulo: string) {
  const response = await fetch(`${API_URL}/libro-favorito`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario, titulo })
  })
  if (!response.ok) throw new Error("Error al marcar favorito")
  return response.json()
}

// ── Amigos ──────────────────────────────────────────────────────────

export async function obtenerAmigos(id_usuario: string) {
  const response = await fetch(`${API_URL}/usuario/${id_usuario}/amigos`)
  if (!response.ok) throw new Error("Error obteniendo amigos")
  return response.json()
}

export async function obtenerTodosUsuarios(id_usuario: string) {
  const response = await fetch(`${API_URL}/usuarios?id_usuario=${id_usuario}`)
  if (!response.ok) throw new Error("Error obteniendo usuarios")
  return response.json()
}

export async function agregarAmigo(id_usuario_1: string, id_usuario_2: string) {
  const response = await fetch(`${API_URL}/agregar-amigo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario_1, id_usuario_2 })
  })
  if (!response.ok) throw new Error("Error al agregar amigo")
  return response.json()
}

// ── Cuenta ──────────────────────────────────────────────────────────

export async function obtenerEstadisticas(id_usuario: string) {
  const response = await fetch(`${API_URL}/usuario/${id_usuario}/estadisticas`)
  if (!response.ok) throw new Error("Error obteniendo estadísticas")
  return response.json()
}

export async function obtenerFavoritos(id_usuario: string) {
  const response = await fetch(`${API_URL}/usuario/${id_usuario}/favoritos`)
  if (!response.ok) throw new Error("Error obteniendo favoritos")
  return response.json()
}