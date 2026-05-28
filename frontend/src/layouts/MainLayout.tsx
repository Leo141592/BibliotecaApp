import type { ReactNode } from "react"
import Sidebar from "../components/Sidebar"

type MainLayoutProps = {
  children: ReactNode
}

function MainLayout({
  children
}: MainLayoutProps) {

  return (

    <div className="min-h-screen bg-gray-100 flex">

      <div className="flex-1 p-8">
        {children}
      </div>

      <Sidebar />

    </div>

  )
}

export default MainLayout