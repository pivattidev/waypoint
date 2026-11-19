import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { LinkBotao } from '../components/Button'

const ordem = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * Elemento criativo da 404: uma rota que atravessa a página inteira e termina numa barreira (rua sem saída).
 * O ponto de partida e a barreira são HTML; só a linha é SVG, para o traço não deformar em telas largas.
 */
function RotaSemSaida() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="size-5 shrink-0 rounded-full border-4 border-ink bg-bg" />
      <svg viewBox="0 0 1000 12" preserveAspectRatio="none" className="h-3 flex-1">
        <path d="M0 6 H1000" fill="none" stroke="var(--route)" strokeWidth="4" strokeLinecap="round" pathLength={1} className="rota-tracada" />
      </svg>
      {/* Barreira: surge quando a rota chega */}
      <span className="pousar h-14 w-2.5 shrink-0 rounded-full bg-alert" style={{ animationDelay: '1.6s' }} />
    </div>
  )
}

/** 404: conteúdo centralizado e a rota sem saída de ponta a ponta. */
export default function NaoEncontrada() {
  return (
    <div className="flex min-h-[64dvh] flex-col justify-center gap-14 py-6">
      <div className="entrar" style={ordem(0)}>
        <RotaSemSaida />
      </div>

      <div className="flex flex-col items-center text-center">
        <p className="tabular entrar text-sm font-bold text-muted" style={ordem(1)}>
          Erro 404
        </p>
        <h1 className="entrar mt-3 text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.05em]" style={ordem(2)}>
          Rua sem saída
        </h1>
        <p className="entrar mt-6 max-w-xl text-xl text-muted" style={ordem(3)}>
          Essa página não existe ou mudou de endereço. Escolha outro caminho.
        </p>

        <div className="entrar mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" style={ordem(4)}>
          <LinkBotao to="/" replace>
            Voltar ao início
          </LinkBotao>
          <Link to="/mapa" className="inline-flex min-h-11 items-center font-bold text-link underline-offset-4 hover:underline">
            Ver o mapa
          </Link>
          <Link to="/relatos" className="inline-flex min-h-11 items-center font-bold text-link underline-offset-4 hover:underline">
            Ver os relatos
          </Link>
        </div>
      </div>
    </div>
  )
}
