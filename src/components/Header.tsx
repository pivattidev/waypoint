import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const links = [
  { para: '/', rotulo: 'Home' },
  { para: '/integrantes', rotulo: 'Integrantes' },
  { para: '/sobre', rotulo: 'Sobre' },
  { para: '/faq', rotulo: 'FAQ' },
  { para: '/contato', rotulo: 'Contato' },
]

function classeLinkCelular({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-ctl px-3 py-3 text-lg font-bold ${
    isActive ? 'bg-tealbg text-ink' : 'text-ink-2 hover:bg-mist'
  }`
}

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  // Fecha com Esc
  useEffect(() => {
    if (!menuAberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAberto(false)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [menuAberto])

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-[76px] max-w-[1760px] items-center gap-6 px-4 sm:px-6 lg:px-12">
        <Logo />

        <nav aria-label="Principal" className="hidden gap-4 xl:flex">
          {links.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              end={link.para === '/'}
              className={({ isActive }) => (isActive ? 'font-bold text-ink' : 'text-muted hover:text-ink')}
            >
              {link.rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-ctl text-ink hover:bg-tealbg xl:hidden"
            aria-expanded={menuAberto}
            aria-controls="menu-celular"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuAberto((aberto) => !aberto)}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              {menuAberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuAberto && (
        // Clicar em qualquer link do menu fecha o menu (o clique "sobe" do link até o nav)
        <nav
          id="menu-celular"
          aria-label="Menu"
          onClick={() => setMenuAberto(false)}
          className="surgir max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-line/60 px-4 pb-6 pt-3 xl:hidden"
        >
          {links.map((link) => (
            <NavLink key={link.para} to={link.para} end={link.para === '/'} className={classeLinkCelular}>
              {link.rotulo}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
