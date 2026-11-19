import type { StatusRelato } from '../types/relato'
import Carimbo from './Carimbo'
import Selo from './Selo'

/** Status do relato com forma + texto (nunca só cor). Aprovado vira o carimbo da moderação. */
export default function StatusBadge({ status }: { status: StatusRelato }) {
  if (status === 'APROVADO') return <Carimbo />

  if (status === 'PENDENTE') {
    return (
      <Selo tom="apagado">
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="8" cy="8" r="6.5" />
          <path d="M8 4.5V8l2.5 1.5" />
        </svg>
        Em moderação
      </Selo>
    )
  }

  return (
    <Selo tom="relato">
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
      </svg>
      Rejeitado
    </Selo>
  )
}
