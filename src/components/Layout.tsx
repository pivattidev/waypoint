import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <Header />
      <main id="conteudo" className="mx-auto w-full max-w-[1760px] flex-1 px-4 pb-24 pt-12 sm:px-6 lg:px-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
