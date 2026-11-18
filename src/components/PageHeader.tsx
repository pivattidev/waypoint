import type { CSSProperties, ReactNode } from 'react'
import Pin from './Pin'

/** Como termina a linha da rota sob o título: cada página "chega" num lugar diferente. */
export type MarcoPagina = 'pin' | 'destino' | 'carimbo' | 'nenhum'

interface PageHeaderProps {
  titulo: string
  marco?: MarcoPagina
  /** Texto de apoio abaixo do título. */
  children?: ReactNode
  /** Conteúdo encostado na borda direita (contagem, ação): usa a largura toda da página. */
  lateral?: ReactNode
}

function FimDaRota({ marco }: { marco: MarcoPagina }) {
  if (marco === 'pin') return <Pin className="size-4" />
  if (marco === 'destino') return <Pin tipo="destino" className="size-3.5" />
  if (marco === 'carimbo')
    return (
      <svg viewBox="0 0 24 24" className="size-4 text-link" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5l8 3.2v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6l8-3.2Z" />
        <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
      </svg>
    )
  return null
}

/**
 * Cabeçalho de página, versão enxuta: título, uma frase de apoio e, à direita, um dado ou ação.
 * Embaixo, a linha da rota fina (ponto de partida, traço e o marco de chegada da página).
 * Entra com a animação de surgimento (.entrar).
 */
export default function PageHeader({ titulo, marco = 'destino', children, lateral }: PageHeaderProps) {
  return (
    <header className="mb-10 sm:mb-12">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="min-w-0">
          <h1 className="entrar max-w-4xl text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">{titulo}</h1>
          {children && (
            <div className="entrar mt-4 max-w-xl text-lg text-muted" style={{ '--i': 1 } as CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {lateral && (
          <div className="entrar shrink-0" style={{ '--i': 2 } as CSSProperties}>
            {lateral}
          </div>
        )}
      </div>
      <div className="entrar mt-8 flex items-center gap-2" style={{ '--i': 2 } as CSSProperties} aria-hidden>
        <span className="size-2.5 shrink-0 rounded-full border-2 border-muted" />
        <span className="h-px flex-1 bg-line" />
        <FimDaRota marco={marco} />
      </div>
    </header>
  )
}
