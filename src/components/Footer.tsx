import { Link } from 'react-router-dom'
import { MarcaWaypoint } from './Logo'

const colunas = [
  { titulo: 'Projeto', links: [['/sobre', 'Sobre'], ['/integrantes', 'Integrantes'], ['/faq', 'FAQ'], ['/contato', 'Contato']] },
]

/** Rodapé com a marca, o aviso de emergência e os links do site. */
export default function Footer() {
  return (
    <footer className="text-ink">
      <div className="mx-auto max-w-[1760px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-12 border-t border-line py-14 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="flex items-center gap-2 font-display text-2xl font-black tracking-[-0.04em]">
              <MarcaWaypoint className="h-8 w-auto" />
              WayPoint
            </p>
            <p className="mt-4 max-w-sm text-[17px] text-ink-2">
              Rotas a pé com relatos recentes da comunidade. Moderado antes de publicar e sem identificar quem enviou.
            </p>
            <p className="mt-8 inline-flex items-center gap-3 rounded-ctl border border-alert/60 px-4 py-2.5 font-bold">
              <span className="size-2 rounded-full bg-alert" aria-hidden />
              Em emergência, ligue 190
            </p>
          </div>
          {colunas.map((coluna) => (
            <nav key={coluna.titulo} aria-label={coluna.titulo}>
              <p className="font-display text-lg font-bold">{coluna.titulo}</p>
              <ul className="mt-3 space-y-1 text-[17px]">
                {coluna.links.map(([para, rotulo]) => (
                  <li key={para}>
                    <Link to={para} className="inline-flex min-h-10 items-center text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                      {rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-t border-line py-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Global Solution 2026/2, FIAP. ODS 11 e ODS 10.</p>
        </div>
      </div>
    </footer>
  )
}
