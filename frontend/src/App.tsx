import { Routes, Route } from "react-router-dom"
import FriendsPage from "./pages/FriendsPage"
import AccountPage from "./pages/AccountPage"
import ExplorePage from "./pages/ExplorePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import BookDetailsPage from "./pages/BookDetailsPage"
import SearchFriendsPage from "./pages/SearchFriendsPage"

function App() {

  return (

    <Routes>

      <Route path="/" element={<LoginPage />} />

      <Route path="/account" element={<AccountPage />} />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/home"
        element={<HomePage />}
      />

      <Route
        path="/books/:id"
        element={<BookDetailsPage />}
      />

      <Route path="/explore" element={<ExplorePage />} />

      <Route
  path="/friends"
  element={<FriendsPage />}
/>

<Route
  path="/search-friends"
  element={<SearchFriendsPage />}
/>

    </Routes>

  )
}

export default App