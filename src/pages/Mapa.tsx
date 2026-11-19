import { useState, type CSSProperties } from 'react'
import { LinkBotao } from '../components/Button'
import CategoriaIcone from '../components/CategoriaIcone'
import { Carregando, ListaVazia, MensagemErro } from '../components/EstadoTela'
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

  const relatos = useRequisicao(() => (regiaoId === null ? Promise.resolve([]) : listarRelatosDaRegiao(regiaoId)), [regiaoId])
  const regiao = regioes.dados?.find((g) => g.id === regiaoId) ?? null

  const lista = relatos.dados ?? []

  return (
    <div className="max-w-xl">
      <h1 className="entrar text-[clamp(2.25rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.04em]">Mapa</h1>
      <p className="entrar mt-3 text-[17px] text-muted" style={ordem(1)}>
        Relatos aprovados por região.
      </p>

      {regioes.carregando && <div className="mt-6 h-11 w-3/4 animate-pulse rounded-full bg-skeleton" aria-hidden />}
      {regioes.erro && (
        <div className="mt-6">
          <MensagemErro titulo="Não foi possível carregar as regiões" mensagem={regioes.erro.message} onTentarNovamente={regioes.recarregar} />
        </div>
      )}
      {regioes.dados && (
        <div role="group" aria-label="Regiões" className="entrar faixa-rolavel mt-6 border-b border-line" style={ordem(2)}>
          <div className="flex w-max gap-5">
            {regioes.dados.map((g) => (
              <button key={g.id} type="button" aria-pressed={g.id === regiaoId} onClick={() => setEscolhida(g.id)} className={abaRegiao(g.id === regiaoId)}>
                {g.nome}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6">
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
            <p className="tabular entrar pb-1 text-sm font-bold text-muted" style={ordem(3)} aria-live="polite">
              {lista.length} {lista.length === 1 ? 'relato' : 'relatos'}
              {regiao ? ` em ${regiao.nome}` : ''}
            </p>
            <ul>
              {lista.map((r, i) => (
                <li key={r.id} className="entrar grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-3 border-b border-line py-4" style={ordem(4 + i)}>
                  <span className="mt-0.5 grid size-7 place-items-center rounded-full bg-alert-bg text-alert-text">
                    <CategoriaIcone nome={r.categoriaNome} className="size-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold leading-snug">{r.titulo}</span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {r.logradouro}, {tempoDecorrido(r.dataOcorrencia)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
