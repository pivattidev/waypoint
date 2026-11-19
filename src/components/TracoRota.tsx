import type { ReactNode } from 'react'
import Pin from './Pin'

export type EstadoMarco = 'feito' | 'atual' | 'proximo'

export interface Marco {
  id: string
  titulo: ReactNode
  estado: EstadoMarco
}

interface TracoRotaProps {
  marcos: Marco[]
  /** Clicar num marco já feito (ex.: voltar a uma etapa do formulário). */
  onEscolher?: (id: string) => void
  className?: string
}

/** Marcador do ponto: parada (ponto teal) ou destino (pin). */
function Ponto({ indice, total, estado }: { indice: number; total: number; estado: EstadoMarco }) {
  if (indice === total - 1) return <Pin tipo="destino" className={`size-7 ${estado === 'proximo' ? 'opacity-50' : ''}`} />
  const cheio = estado === 'feito' || estado === 'atual'
  return (
    <span
      className={`grid size-5 place-items-center rounded-full ring-4 ring-bg transition-colors duration-200 ${
        cheio ? 'bg-teal' : 'border-2 border-line-strong bg-bg'
      } ${estado === 'atual' ? 'outline-2 outline-offset-2 outline-teal' : ''}`}
    />
  )
}

/**
 * Itinerário (modo Itinerário): uma SEQUÊNCIA REAL vira rota.
 * Paradas ligadas por traço (sólido no trecho já percorrido) e o destino com pin.
 * Usado nas etapas do envio de relato.
 */
export default function TracoRota({ marcos, onEscolher, className = '' }: TracoRotaProps) {
  const total = marcos.length

  return (
    <ol className={`grid ${className}`} style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
      {marcos.map((m, i) => {
        const clicavel = onEscolher && m.estado === 'feito'
        const conteudo = (
          <>
            <span className="relative z-10 grid h-8 place-items-center">
              <Ponto indice={i} total={total} estado={m.estado} />
            </span>
            <span className={`mt-1 block text-[13px] font-bold ${m.estado === 'atual' ? 'text-ink' : 'text-muted'}`}>{m.titulo}</span>
          </>
        )
        return (
          <li key={m.id} className="relative flex flex-col items-center text-center" aria-current={m.estado === 'atual' ? 'step' : undefined}>
            {/* Trecho até o próximo marco: sólido se já percorrido */}
            {i < total - 1 && (
              <span
                aria-hidden
                className={`absolute left-1/2 top-[15px] h-0.5 w-full transition-colors duration-200 ${
                  m.estado === 'feito' ? 'bg-teal' : 'bg-[repeating-linear-gradient(to_right,var(--line-strong)_0_6px,transparent_6px_11px)]'
                }`}
              />
            )}
            {clicavel ? (
              <button type="button" onClick={() => onEscolher(m.id)} className="flex flex-col items-center rounded-ctl px-1">
                {conteudo}
              </button>
            ) : (
              conteudo
            )}
          </li>
        )
      })}
    </ol>
  )
}
