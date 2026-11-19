import type { CSSProperties } from 'react'
import { LinkBotao } from '../components/Button'

const container = 'mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-12'

export default function Home() {
  return (
    <>
      {/* Hero: por enquanto só o texto e as chamadas; o mapa noturno entra depois */}
      <section aria-labelledby="titulo-hero" className="pb-24 pt-[calc(76px+4rem)]">
        <div className={container}>
          <h1 id="titulo-hero" className="entrar max-w-3xl font-display text-[clamp(2.75rem,6.4vw,5.25rem)] font-black leading-[0.92] tracking-[-0.045em]">
            Veja a rua antes de pisar nela.
          </h1>
          <p className="entrar mt-6 max-w-[28rem] text-lg text-muted sm:text-xl" style={{ '--i': 1 } as CSSProperties}>
            Rotas a pé com relatos recentes da comunidade, por região. Sem login e sem dar seu nome.
          </p>
          <div className="entrar mt-10 flex flex-wrap gap-3" style={{ '--i': 2 } as CSSProperties}>
            <LinkBotao to="/mapa">Ver o mapa</LinkBotao>
            <LinkBotao to="/relatos" variante="neutro">
              Ver relatos
            </LinkBotao>
          </div>
        </div>
      </section>
    </>
  )
}
