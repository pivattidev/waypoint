import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const { pathname } = useLocation()

  // Chaves no corpo: scrollTo devolve uma Promise em navegadores novos,
  // e o React trataria o retorno como função de limpeza.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-ctl focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Pular para o conteúdo
      </a>
      {/* Header fixo e translúcido: o conteúdo passa por baixo dele */}
      <Header />
      <main id="conteudo" className="mx-auto w-full max-w-[1760px] flex-1 px-4 pb-24 pt-[calc(76px+3rem)] sm:px-6 sm:pt-[calc(76px+4rem)] lg:px-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
