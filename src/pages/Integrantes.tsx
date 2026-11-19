import PageHeader from '../components/PageHeader'
import { integrantes } from '../services/integrantes'
import type { Integrante } from '../types/Integrante'

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
          </li>
        ))}
      </ul>
    </>
  )
}
