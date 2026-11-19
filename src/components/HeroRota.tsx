import { useState, type CSSProperties, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMidia } from '../hooks/useMidia'
import { PONTOS_RELATO, POSTES, type IdRota } from '../utils/rotasExemplo'
import MapaNoturno from './MapaNoturno'
import SeletorRota, { type OpcaoRota } from './SeletorRota'

/**
 * As duas rotas do EXEMPLO ilustrado (o cálculo real vem do GET /rotas da API, fase 2).
 * Mesmos números do conceito: "18 min, 3 relatos" x "22 min, 0 relatos".
 */
const OPCOES: OpcaoRota[] = [
  { id: 'direta', minutos: 18, via: 'Pela R. Augusta', relatos: PONTOS_RELATO.length },
  { id: 'iluminada', minutos: 22, via: 'Pela Av. da Consolação', relatos: 0 },
]

const acesos = POSTES.iluminada.filter((p) => p.aceso).length

/**
 * Recorte justo em volta das duas rotas (com as etiquetas).
 * No desktop o mapa usa "meet": o recorte aparece inteiro e centralizado, e as ruas continuam em volta.
 * Assim as rotas nunca ficam embaixo do texto nem do painel, em qualquer largura de tela.
 */
const RECORTE_ROTAS = '660 30 840 760'

const campoNoite =
  'w-full min-h-12 bg-transparent px-0 py-2 text-[17px] text-nite-ink placeholder:text-nite-muted/80 border-0 border-b-2 border-nite-line focus:border-nite-teal transition-colors aria-invalid:border-nite-alert'

/** Resumo da rota escolhida: uma frase e um apoio. */
function Resumo({ rota }: { rota: IdRota }) {
  return (
    <div aria-live="polite">
      {rota === 'iluminada' ? (
        <>
          <p className="font-bold text-nite-ink">{acesos} postes acesos, nenhum relato no caminho</p>
          <p className="mt-1 text-[15px] text-nite-muted">Quatro minutos a mais, com luz do começo ao fim.</p>
        </>
      ) : (
        <>
          <p className="font-bold text-nite-alert-text">{PONTOS_RELATO.length} relatos no trecho escuro</p>
          <p className="mt-1 text-[15px] text-nite-muted">Mais curta, mas passa por postes apagados.</p>
        </>
      )}
    </div>
  )
}

export default function HeroRota() {
  const navigate = useNavigate()
  // Monta só UMA versão do mapa (desktop ou celular): o SVG é a parte mais pesada da página
  const desktop = useMidia('(min-width: 1280px)')
  // Celular: recorte que preenche o cartão. Tablet: recorte inteiro ("meet"), para as rotas não serem cortadas
  const celular = !useMidia('(min-width: 640px)')
  const [rota, setRota] = useState<IdRota>('iluminada')
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [erros, setErros] = useState<{ origem?: string; destino?: string }>({})

  // Valida antes de "buscar". Partida e destino vão por estado de navegação (não ficam na URL nem são salvos).
  const buscar = (e: FormEvent) => {
    e.preventDefault()
    const novos = {
      origem: origem.trim().length < 3 ? 'Diga de onde você sai: rua, estação ou ponto de referência.' : undefined,
      destino: destino.trim().length < 3 ? 'Diga para onde você vai.' : undefined,
    }
    setErros(novos)
    if (novos.origem || novos.destino) {
      document.getElementById(novos.origem ? 'origem' : 'destino')?.focus()
      return
    }
    navigate('/mapa', { state: { origem: origem.trim(), destino: destino.trim() } })
  }

  const notaExemplo = <p className="text-[13px] text-nite-muted">Exemplo ilustrado. O cálculo de rota chega com a API.</p>

  return (
    <section aria-labelledby="titulo-hero" className="relative isolate overflow-hidden bg-nite-bg pb-32 text-nite-ink">
      {/* Desktop: camada do mapa à direita do texto (começa onde a coluna de texto termina) */}
      {desktop && (
        <div className="entrar absolute inset-y-0 left-[max(616px,calc(50%-264px))] right-0 -z-10 [contain:strict]" style={{ '--i': 1 } as CSSProperties} aria-hidden>
          {/* Rotas na parte de cima; o painel fica embaixo, sem cobrir nada */}
          <div className="absolute inset-x-0 bottom-[420px] top-[100px]">
            <MapaNoturno rotaSelecionada={rota} recorte={RECORTE_ROTAS} encaixe="meet" />
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

          {/* Celular e tablet: o mapa e a escolha de rota entram já na primeira tela */}
          {!desktop && (
            <div className="entrar mt-8" style={{ '--i': 2 } as CSSProperties}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-mapa border border-nite-line sm:aspect-[16/9] sm:p-6">
                {celular ? (
                  <MapaNoturno rotaSelecionada={rota} recorte="640 40 940 705" />
                ) : (
                  <MapaNoturno rotaSelecionada={rota} recorte={RECORTE_ROTAS} encaixe="meet" />
                )}
              </div>
              <SeletorRota opcoes={OPCOES} valor={rota} onMudar={setRota} className="mt-3" />
              <div className="mt-4 flex flex-col gap-3 px-1">
                <Resumo rota={rota} />
                {notaExemplo}
              </div>
            </div>
          )}

          <form onSubmit={buscar} noValidate className="entrar mt-10 max-w-[28rem]" style={{ '--i': 3 } as CSSProperties} aria-label="Buscar rota a pé">
            <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4">
              {/* Trilho do bilhete: origem (bolinha neutra), pontilhado, destino (bolinha vermelha) */}
              <div className="row-span-2 flex flex-col items-center pb-5 pt-9" aria-hidden>
                <span className="size-4 rounded-full border-[3px] border-nite-ink" />
                <span className="my-1.5 w-0 flex-1 border-l-2 border-dotted border-nite-muted/70" />
                <span className="grid size-[18px] place-items-center rounded-full bg-nite-alert">
                  <span className="size-2 rounded-full bg-nite-bg" />
                </span>
              </div>
              <div className="pb-4">
                <label htmlFor="origem" className="text-sm font-bold text-nite-muted">
                  Onde você está
                </label>
                <input
                  id="origem"
                  value={origem}
                  onChange={(e) => {
                    setOrigem(e.target.value)
                    setErros((x) => ({ ...x, origem: undefined }))
                  }}
                  aria-invalid={!!erros.origem || undefined}
                  aria-describedby={erros.origem ? 'origem-msg' : undefined}
                  className={campoNoite}
                  placeholder="Estação Sé"
                  autoComplete="off"
                />
                {erros.origem && (
                  <p id="origem-msg" className="mt-1.5 text-sm font-bold text-nite-alert-text">
                    {erros.origem}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="destino" className="text-sm font-bold text-nite-muted">
                  Para onde você vai?
                </label>
                <input
                  id="destino"
                  value={destino}
                  onChange={(e) => {
                    setDestino(e.target.value)
                    setErros((x) => ({ ...x, destino: undefined }))
                  }}
                  aria-invalid={!!erros.destino || undefined}
                  aria-describedby={erros.destino ? 'destino-msg' : undefined}
                  className={campoNoite}
                  placeholder="Av. Paulista, 1000"
                  autoComplete="off"
                />
                {erros.destino && (
                  <p id="destino-msg" className="mt-1.5 text-sm font-bold text-nite-alert-text">
                    {erros.destino}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-ctl bg-nite-teal px-6 font-bold text-nite-on-teal transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.97] sm:w-auto"
            >
              Buscar rota
            </button>
          </form>

          <blockquote style={{ '--i': 4 } as CSSProperties} className="entrar mt-12 max-w-[28rem] border-l-2 border-nite-teal pl-4 text-[15px] text-nite-muted">
            Todo relato passa por moderação antes de aparecer no mapa, e a identidade de quem enviou fica protegida.
          </blockquote>
        </div>
      </div>

      {/* Desktop: painel de rotas na mesma faixa do mapa, centralizado embaixo das rotas (nunca por cima delas) */}
      {desktop && (
        <div className="entrar absolute bottom-32 right-[max(48px,calc(50%-832px))] w-[420px]" style={{ '--i': 3 } as CSSProperties}>
          <div className="w-full max-w-[420px] rounded-painel border border-nite-line bg-nite-panel p-2 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.55)]">
            <SeletorRota opcoes={OPCOES} valor={rota} onMudar={setRota} />
            <div className="flex flex-col gap-3 px-3 pb-2 pt-4">
              <Resumo rota={rota} />
              <div className="border-t border-nite-line pt-3">{notaExemplo}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
