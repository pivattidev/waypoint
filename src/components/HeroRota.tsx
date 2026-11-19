import type { CSSProperties } from 'react'
import { useMidia } from '../hooks/useMidia'
import MapaNoturno from './MapaNoturno'

/**
 * Recorte justo em volta das duas rotas (com as etiquetas).
 * No desktop o mapa usa "meet": o recorte aparece inteiro e centralizado, e as ruas continuam em volta.
 * Assim as rotas nunca ficam embaixo do texto nem do painel, em qualquer largura de tela.
 */
const RECORTE_ROTAS = '660 30 840 760'

export default function HeroRota() {
  // Monta só UMA versão do mapa (desktop ou celular): o SVG é a parte mais pesada da página
  const desktop = useMidia('(min-width: 1280px)')
  // Celular: recorte que preenche o cartão. Tablet: recorte inteiro ("meet"), para as rotas não serem cortadas
  const celular = !useMidia('(min-width: 640px)')

  return (
    <section aria-labelledby="titulo-hero" className="relative isolate overflow-hidden bg-nite-bg pb-32 text-nite-ink">
      {/* Desktop: camada do mapa à direita do texto (começa onde a coluna de texto termina) */}
      {desktop && (
        <div className="entrar absolute inset-y-0 left-[max(616px,calc(50%-264px))] right-0 -z-10 [contain:strict]" style={{ '--i': 1 } as CSSProperties} aria-hidden>
          {/* Rotas na parte de cima; o painel fica embaixo, sem cobrir nada */}
          <div className="absolute inset-x-0 bottom-[420px] top-[100px]">
            <MapaNoturno rotaSelecionada="iluminada" recorte={RECORTE_ROTAS} encaixe="meet" />
          </div>
          {/* A borda esquerda do mapa some no fundo: texto e mapa ficam juntos, sem moldura */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-nite-bg to-transparent" />
        </div>
      )}
      {/* O fim do hero se dissolve no fundo da página: a Home é uma superfície só */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--bg)_25%,transparent)_35%,color-mix(in_oklab,var(--bg)_70%,transparent)_70%,var(--bg))]"
        aria-hidden
      />

      {/* pt-[76px]: o hero começa por trás do header translúcido */}
      <div className="pointer-events-none mx-auto grid max-w-[1760px] px-4 pt-[76px] sm:px-6 xl:min-h-[min(calc(100dvh-2rem),920px)] lg:px-12">
        <div className="pointer-events-auto flex flex-col justify-center pb-6 pt-10 xl:max-w-[520px] xl:py-16">
          <h1 id="titulo-hero" style={{ '--i': 0 } as CSSProperties} className="entrar font-display text-[clamp(2.75rem,6.4vw,5.25rem)] font-black leading-[0.92] tracking-[-0.045em]">
            Veja a rua antes de pisar nela.
          </h1>
          <p className="entrar mt-6 max-w-[28rem] text-lg text-nite-muted sm:text-xl" style={{ '--i': 1 } as CSSProperties}>
            Rotas a pé com relatos recentes da comunidade, por região. Sem login e sem dar seu nome.
          </p>

          {/* Celular e tablet: o mapa entra já na primeira tela */}
          {!desktop && (
            <div className="entrar mt-8" style={{ '--i': 2 } as CSSProperties}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-mapa border border-nite-line sm:aspect-[16/9] sm:p-6">
                {celular ? (
                  <MapaNoturno rotaSelecionada="iluminada" recorte="640 40 940 705" />
                ) : (
                  <MapaNoturno rotaSelecionada="iluminada" recorte={RECORTE_ROTAS} encaixe="meet" />
                )}
              </div>
            </div>
          )}

          <blockquote style={{ '--i': 4 } as CSSProperties} className="entrar mt-12 max-w-[28rem] border-l-2 border-nite-teal pl-4 text-[15px] text-nite-muted">
            Todo relato passa por moderação antes de aparecer no mapa, e a identidade de quem enviou fica protegida.
          </blockquote>
        </div>
      </div>
    </section>
  )
}
