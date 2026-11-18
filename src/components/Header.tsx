import { NavLink } from 'react-router-dom'

const links = [
  { para: '/', rotulo: 'Home' },
  { para: '/integrantes', rotulo: 'Integrantes' },
  { para: '/sobre', rotulo: 'Sobre' },
  { para: '/faq', rotulo: 'FAQ' },
  { para: '/contato', rotulo: 'Contato' },
]

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex min-h-[76px] max-w-[1760px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-12">
        <span className="font-display text-[22px] font-black tracking-[-0.04em]">WayPoint</span>
        <nav aria-label="Principal" className="flex flex-wrap gap-x-4 gap-y-1">
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
      </div>
    </header>
  )
}
