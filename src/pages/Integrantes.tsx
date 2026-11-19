import PageHeader from '../components/PageHeader'
import { integrantes } from '../services/Integrantes'
import type { Integrante } from '../types/Integrante'

const linkClasse =
  'inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-[15px] font-bold text-ink transition-colors hover:border-teal hover:text-link'

function Foto({ pessoa }: { pessoa: Integrante }) {
  if (pessoa.foto) {
    return <img src={pessoa.foto} width={88} height={88} loading="lazy" alt={`Foto de ${pessoa.nome}`} className="size-[88px] shrink-0 rounded-full object-cover" />
  }
  return (
    <span className="grid size-[88px] shrink-0 place-items-center rounded-full bg-tealbg font-display text-3xl font-extrabold text-link" aria-hidden>
      {pessoa.nome
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')}
    </span>
  )
}

function IconeGithub() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

function IconeLinkedin() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5ZM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z" />
    </svg>
  )
}

export default function Integrantes() {
  return (
    <>
      <PageHeader titulo="Integrantes">
        <p>Responsáveis pelo projeto:</p>
      </PageHeader>

      <ul className="border-t border-line">
        {integrantes.map((pessoa) => (
          <li key={pessoa.nome} className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-6 gap-y-5 border-b border-line py-8">
            <Foto pessoa={pessoa} />
            <div className="min-w-0">
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-none tracking-[-0.03em]">{pessoa.nome}</h2>
              <p className="tabular mt-2 text-sm font-bold text-muted">
                Turma {pessoa.turma}, {pessoa.rm}
              </p>
            </div>
            <p className="col-span-2 text-lg text-ink-2">{pessoa.papel}</p>
            <div className="col-span-2 flex flex-wrap gap-2">
              <a href={pessoa.github} target="_blank" rel="noreferrer" className={linkClasse}>
                <IconeGithub />
                GitHub<span className="sr-only"> de {pessoa.nome} (abre em nova aba)</span>
              </a>
              <a href={pessoa.linkedin} target="_blank" rel="noreferrer" className={linkClasse}>
                <IconeLinkedin />
                LinkedIn<span className="sr-only"> de {pessoa.nome} (abre em nova aba)</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
