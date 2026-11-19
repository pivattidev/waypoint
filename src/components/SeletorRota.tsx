import type { IdRota } from '../utils/rotasExemplo'

export interface OpcaoRota {
  id: IdRota
  minutos: number
  /** Rua principal do trajeto: "Pela R. Augusta". */
  via: string
  /** Quantos relatos aprovados ficam perto do trajeto. */
  relatos: number
}

interface SeletorRotaProps {
  opcoes: OpcaoRota[]
  valor: IdRota
  onMudar: (id: IdRota) => void
  className?: string
}

/**
 * Escolha entre as rotas ("18 min, 3 relatos" x "22 min, 0 relatos"): o diferencial do WayPoint.
 * Dois botões com aria-pressed (o leitor de tela diz qual está escolhido).
 * Reaproveitável quando o GET /rotas da API existir: basta passar as opções vindas dela.
 * Pensado para ficar sobre o mapa noturno (cores --nite-*).
 */
export default function SeletorRota({ opcoes, valor, onMudar, className = '' }: SeletorRotaProps) {
  return (
    <div role="group" aria-label="Rotas a pé" className={`grid grid-cols-2 gap-1 rounded-[12px] bg-nite-bg/80 p-1 ${className}`}>
      {opcoes.map((op) => {
        const ativa = op.id === valor
        const semRelato = op.relatos === 0
        return (
          <button
            key={op.id}
            type="button"
            aria-pressed={ativa}
            onClick={() => onMudar(op.id)}
            className={`min-w-0 rounded-[9px] border-2 px-3 py-2.5 text-left transition-colors duration-150 ${
              ativa ? 'border-nite-teal bg-nite-panel' : 'border-transparent hover:bg-nite-line/50'
            }`}
          >
            <span className="tabular block font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.03em] text-nite-ink">
              {op.minutos}
              <span className="ml-1 text-sm font-bold text-nite-muted">min a pé</span>
            </span>
            <span className="mt-1.5 block truncate text-[13px] font-bold text-nite-muted">{op.via}</span>
            <span className={`mt-1 flex items-center gap-1.5 text-sm font-bold ${semRelato ? 'text-nite-teal' : 'text-nite-alert-text'}`}>
              {semRelato ? (
                // Poste aceso: trecho sem relatos aprovados recentes
                <span className="relative grid size-3.5 place-items-center" aria-hidden>
                  <span className="absolute inset-0 rounded-full bg-lamp/40 blur-[2px]" />
                  <span className="size-1.5 rounded-full bg-lamp-glow" />
                </span>
              ) : (
                <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden>
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z" fill="currentColor" />
                </svg>
              )}
              <span className="tabular">
                {op.relatos} {op.relatos === 1 ? 'relato' : 'relatos'}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
