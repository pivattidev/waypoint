import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { LinkBotao } from '../components/Button'
import { Carregando, ListaVazia, MensagemErro } from '../components/EstadoTela'
import ItemRelato from '../components/ItemRelato'
import Pin from '../components/Pin'
import Revelar from '../components/Revelar'
import { useRequisicao } from '../hooks/useRequisicao'
import { listarRelatos } from '../services/relatos'

/** Como funciona: é uma sequência de verdade, então cada passo é uma parada da rota. */
const paradas = [
  { titulo: 'Confira o trajeto', texto: 'Escolha a região e veja no mapa o que quem passou por ali relatou nos últimos dias.' },
  { titulo: 'Relate o que viu', texto: 'Poste apagado, calçada quebrada, rua vazia depois das dez. Sem nome, sem e-mail, sem login.' },
  { titulo: 'A moderação confere', texto: 'Cada relato é lido antes de ir para o mapa. O que expõe alguém ou não ajuda quem anda a pé fica de fora.' },
]

const container = 'mx-auto w-full max-w-[1760px] px-4 sm:px-6 lg:px-12'

/** Marcador de cada parada: partida (anel), parada (ponto teal) e chegada (pin). */
function Marcador({ indice }: { indice: number }) {
  if (indice === 0) return <span className="block size-6 rounded-full border-[3px] border-ink bg-bg" />
  if (indice === paradas.length - 1) return <Pin tipo="destino" className="size-6" />
  return <span className="block size-6 rounded-full border-[6px] border-bg bg-teal ring-2 ring-teal" />
}

/**
 * Itinerário das três paradas: na horizontal no desktop (uma linha liga os pontos),
 * na vertical no celular. Cada parada surge ao rolar, em sequência.
 */
function Itinerario() {
  return (
    <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
      {paradas.map((p, i) => (
        <Revelar key={p.titulo} como="li" indice={i} className="relative pl-12 md:pl-0">
          {/* Trecho até a próxima parada: vertical no celular, horizontal no desktop */}
          {i < paradas.length - 1 && (
            <span
              aria-hidden
              className="absolute bottom-[-2.5rem] left-[11px] top-8 w-0.5 bg-[repeating-linear-gradient(to_bottom,var(--teal)_0_8px,transparent_8px_14px)] md:bottom-auto md:left-10 md:right-[-3rem] md:top-[11px] md:h-0.5 md:w-auto md:bg-[repeating-linear-gradient(to_right,var(--teal)_0_8px,transparent_8px_14px)]"
            />
          )}
          <span className="absolute left-0 top-0.5 md:static md:block" aria-hidden>
            <Marcador indice={i} />
          </span>
          <p className="tabular text-sm font-bold text-link md:mt-6">Parada {i + 1}</p>
          <h3 className="mt-1 text-[clamp(1.4rem,2vw,1.75rem)] leading-tight">{p.titulo}</h3>
          <p className="mt-2 max-w-sm text-[17px] text-muted">{p.texto}</p>
        </Revelar>
      ))}
    </ol>
  )
}

export default function Home() {
  const { dados: relatos, carregando, erro, recarregar } = useRequisicao(() => listarRelatos('APROVADO'), [])
  const recentes = (relatos ?? []).slice().sort((a, b) => b.dataOcorrencia.localeCompare(a.dataOcorrencia)).slice(0, 4)

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

      {/* Como funciona: um itinerário de três paradas */}
      <section aria-labelledby="como-funciona" className="pb-24 pt-6 sm:pb-32">
        <div className={container}>
          <Revelar className="mb-14 flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <h2 id="como-funciona" className="max-w-xl text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
              Três paradas entre a dúvida e o caminho.
            </h2>
            <p className="max-w-md text-lg text-muted">
              O WayPoint não adivinha perigo. Ele junta o que as pessoas viram na rua e mostra só o que passou pela moderação.
            </p>
          </Revelar>
          <Itinerario />
        </div>
      </section>

      {/* Relatos recentes: a mesma lista enxuta da página Relatos */}
      <section aria-labelledby="recentes" className="pb-24 sm:pb-32">
        <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16`}>
          <div className="min-w-0">
            <Revelar className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 id="recentes" className="text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
                Visto nos últimos dias
              </h2>
              <Link to="/relatos" className="inline-flex min-h-11 items-center font-bold text-link underline-offset-4 hover:underline">
                Ver todos os relatos
              </Link>
            </Revelar>

            {carregando && <Carregando texto="Buscando relatos" />}
            {erro && <MensagemErro titulo="Não foi possível carregar os relatos" mensagem={erro.message} onTentarNovamente={recarregar} />}
            {relatos && relatos.length === 0 && (
              <ListaVazia titulo="Nenhum relato publicado ainda.">
                <p className="mb-4">Passou por algo que outras pessoas deveriam saber?</p>
                <LinkBotao to="/enviar-relato">Enviar relato</LinkBotao>
              </ListaVazia>
            )}
            {recentes.length > 0 && (
              <ul className="border-t border-line">
                {recentes.map((r, i) => (
                  <li key={r.id}>
                    <ItemRelato relato={r} indice={i} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
