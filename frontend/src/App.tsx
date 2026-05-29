import { Routes, Route } from "react-router-dom"
import FriendsPage from "./pages/FriendsPage"
import AccountPage from "./pages/AccountPage"
import ExplorePage from "./pages/ExplorePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import BookDetailsPage from "./pages/BookDetailsPage"
import SearchFriendsPage from "./pages/SearchFriendsPage"
import { obtenerSesion } from "./services/api"

function App() {

  // Al cambiar de usuario el id cambia, React desmonta y remonta
  // todos los componentes hijos, limpiando el estado anterior
  const { id_usuario } = obtenerSesion()

  return (
    <Routes>
      <Route path="/"               element={<LoginPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/home"           element={<HomePage        key={id_usuario ?? "guest"} />} />
      <Route path="/books/:id"      element={<BookDetailsPage key={id_usuario ?? "guest"} />} />
      <Route path="/explore"        element={<ExplorePage     key={id_usuario ?? "guest"} />} />
      <Route path="/friends"        element={<FriendsPage     key={id_usuario ?? "guest"} />} />
      <Route path="/search-friends" element={<SearchFriendsPage key={id_usuario ?? "guest"} />} />
      <Route path="/account"        element={<AccountPage     key={id_usuario ?? "guest"} />} />
    </Routes>
  )
}

export default App