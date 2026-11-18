import PageHeader from '../components/PageHeader'
import { integrantes } from '../services/integrantes'

export default function Integrantes() {
  return (
    <>
      <PageHeader titulo="Integrantes">
        <p>Responsáveis pelo projeto:</p>
      </PageHeader>

      <ul className="border-t border-line">
        {integrantes.map((pessoa) => (
          <li key={pessoa.nome} className="border-b border-line py-8">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-none tracking-[-0.03em]">{pessoa.nome}</h2>
            <p className="tabular mt-2 text-sm font-bold text-muted">
              Turma {pessoa.turma}, {pessoa.rm}
            </p>
            <p className="mt-3 text-lg text-ink-2">{pessoa.papel}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
