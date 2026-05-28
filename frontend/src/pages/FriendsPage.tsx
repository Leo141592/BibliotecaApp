import MainLayout from "../layouts/MainLayout"

function FriendsPage() {

  const friends = [
    {
      id: 1,
      username: "Maria",
      booksRead: 42,
      favoriteGenre: "Fantasía",
      favoriteAuthor: "Tolkien"
    },
    {
      id: 2,
      username: "Carlos",
      booksRead: 31,
      favoriteGenre: "Ciencia ficción",
      favoriteAuthor: "Isaac Asimov"
    },
    {
      id: 3,
      username: "Ana",
      booksRead: 18,
      favoriteGenre: "Misterio",
      favoriteAuthor: "Agatha Christie"
    },
    {
      id: 4,
      username: "Diego",
      booksRead: 56,
      favoriteGenre: "Cyberpunk",
      favoriteAuthor: "William Gibson"
    }
  ]

  return (

    <MainLayout>

      <h1 className="text-5xl font-bold mb-10">
        Amigos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {friends.map((friend) => (

          <div
            key={friend.id}
            className="bg-white rounded-2xl shadow-md p-8"
          >

            <h2 className="text-3xl font-bold mb-6">
              {friend.username}
            </h2>

            <div className="flex flex-col gap-4">

              <div>

                <p className="text-gray-500">
                  Libros leídos
                </p>

                <p className="text-2xl font-bold">
                  {friend.booksRead}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Género favorito
                </p>

                <p className="text-2xl font-bold">
                  {friend.favoriteGenre}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Autor favorito
                </p>

                <p className="text-2xl font-bold">
                  {friend.favoriteAuthor}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </MainLayout>

  )
}

export default FriendsPage