import { useState, type CSSProperties } from 'react'
import { LinkBotao } from '../components/Button'
import CategoriaIcone from '../components/CategoriaIcone'
import { Carregando, ListaVazia, MensagemErro } from '../components/EstadoTela'
import MapaPrevia from '../components/MapaPrevia'
import { useRequisicao } from '../hooks/useRequisicao'
import { listarRegioes } from '../services/regioes'
import { listarRelatosDaRegiao } from '../services/relatos'
import { tempoDecorrido } from '../utils/formatar'

const ordem = (i: number) => ({ '--i': i }) as CSSProperties

/** Aba de região: só texto, com sublinhado teal na ativa (o mesmo padrão da página Relatos). */
const abaRegiao = (ativa: boolean) =>
  `relative inline-flex min-h-11 shrink-0 items-center px-1 text-[15px] font-bold transition-colors after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full ${
    ativa ? 'text-ink after:bg-teal' : 'text-muted hover:text-ink after:bg-transparent'
  }`

export default function Mapa() {
  const regioes = useRequisicao(listarRegioes, [])
  // Sem região escolhida, mostra a primeira da lista
  const [escolhida, setEscolhida] = useState<number | null>(null)
  const regiaoId = escolhida ?? regioes.dados?.[0]?.id ?? null
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null)

  const relatos = useRequisicao(() => (regiaoId === null ? Promise.resolve([]) : listarRelatosDaRegiao(regiaoId)), [regiaoId])
  const regiao = regioes.dados?.find((g) => g.id === regiaoId) ?? null

  // Trocar de região limpa a seleção
  const escolherRegiao = (id: number) => {
    setEscolhida(id)
    setSelecionadoId(null)
  }
  const lista = relatos.dados ?? []

  return (
    <div className="flex flex-col pt-[76px] lg:grid lg:h-dvh lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)]">
      {/* Painel (no celular: cabeçalho em cima, lista depois do mapa) */}
      <aside className="min-h-0 max-lg:contents lg:flex lg:flex-col lg:border-r lg:border-line">
        <div className="px-4 pb-4 pt-8 sm:px-6 lg:px-10 max-lg:order-1">
          <h1 className="entrar text-[clamp(2.25rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.04em]">Mapa</h1>
          <p className="entrar mt-3 text-[17px] text-muted" style={ordem(1)}>
            Relatos aprovados por região. Toque num pin para ver o que aconteceu ali.
          </p>

          {regioes.carregando && <div className="mt-6 h-11 w-3/4 animate-pulse rounded-full bg-skeleton" aria-hidden />}
          {regioes.erro && (
            <div className="mt-6">
              <MensagemErro titulo="Não foi possível carregar as regiões" mensagem={regioes.erro.message} onTentarNovamente={regioes.recarregar} />
            </div>
          )}
          {regioes.dados && (
            <div role="group" aria-label="Regiões" className="entrar faixa-rolavel -mx-4 mt-6 border-b border-line px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0" style={ordem(2)}>
              <div className="flex w-max gap-5 lg:w-auto lg:flex-wrap lg:gap-x-5 lg:gap-y-1">
                {regioes.dados.map((g) => (
                  <button key={g.id} type="button" aria-pressed={g.id === regiaoId} onClick={() => escolherRegiao(g.id)} className={abaRegiao(g.id === regiaoId)}>
                    {g.nome}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lista: no desktop rola dentro do painel; no celular vem depois do mapa */}
        <div className="min-h-0 flex-1 px-4 pb-10 sm:px-6 lg:overflow-y-auto lg:px-10 max-lg:order-3 max-lg:pt-6">
          {relatos.carregando && <Carregando texto="Buscando relatos da região" />}
          {relatos.erro && (
            <MensagemErro titulo="Não foi possível carregar os relatos" mensagem={relatos.erro.message} onTentarNovamente={relatos.recarregar} />
          )}
          {!relatos.carregando && relatos.dados && lista.length === 0 && (
            <ListaVazia titulo="Nenhum relato aprovado nesta região nos últimos dias.">
              <p className="mb-4">Passou por algo que outras pessoas deveriam saber?</p>
              <LinkBotao to="/enviar-relato">Enviar relato</LinkBotao>
            </ListaVazia>
          )}
          {!relatos.carregando && lista.length > 0 && (
            <>
              <p className="tabular entrar pb-1 pt-2 text-sm font-bold text-muted lg:pt-4" style={ordem(3)} aria-live="polite">
                {lista.length} {lista.length === 1 ? 'relato' : 'relatos'}
                {regiao ? ` em ${regiao.nome}` : ''}
              </p>
              <ul>
                {lista.map((r, i) => {
                  const ativo = r.id === selecionadoId
                  return (
                    <li key={r.id} className="entrar" style={ordem(4 + i)}>
                      <button
                        type="button"
                        onClick={() => setSelecionadoId(ativo ? null : r.id)}
                        aria-pressed={ativo}
                        // Selecionado: só uma barra teal à esquerda e o título em teal (sem bloco de fundo)
                        className={`group grid w-full grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3 border-b border-l-2 border-b-line py-4 pl-3 text-left transition-colors duration-150 ${
                          ativo ? 'border-l-teal' : 'border-l-transparent hover:border-l-line-strong'
                        }`}
                      >
                        <span className="mt-0.5 grid size-7 place-items-center rounded-full bg-alert-bg text-alert-text">
                          <CategoriaIcone nome={r.categoriaNome} className="size-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className={`block font-bold leading-snug transition-colors ${ativo ? 'text-link' : 'text-ink group-hover:text-link'}`}>{r.titulo}</span>
                          <span className="mt-0.5 block text-sm text-muted">
                            {r.logradouro}, {tempoDecorrido(r.dataOcorrencia)}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      </aside>

      {/* Mapa: ocupa todo o lado direito até a borda da tela; no celular, a largura toda */}
      <div className="entrar relative h-[58dvh] lg:h-full max-lg:order-2" style={ordem(1)}>
        {relatos.carregando || regiaoId === null ? (
          <div className="h-full animate-pulse bg-skeleton" aria-hidden />
        ) : (
          <MapaPrevia relatos={lista} selecionadoId={selecionadoId} onSelecionar={setSelecionadoId} variante="tela" />
        )}
      </div>
    </div>
  )
}
