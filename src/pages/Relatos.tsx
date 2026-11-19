import type { CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LinkBotao } from '../components/Button'
import { Carregando, ListaVazia, MensagemErro } from '../components/EstadoTela'
import ItemRelato from '../components/ItemRelato'
import PageHeader from '../components/PageHeader'
import { useRequisicao } from '../hooks/useRequisicao'
import { listarCategorias, listarRegioes } from '../services/regioes'
import { listarRelatos } from '../services/relatos'

/** Lê um id positivo da URL (?tipo=3, ?regiao=2) ou devolve null. */
function idDaUrl(valor: string | null): number | null {
  const n = Number(valor)
  return Number.isInteger(n) && n > 0 ? n : null
}

/** Aba de região: só texto, com sublinhado teal na ativa (sem caixas). */
const abaRegiao = (ativa: boolean) =>
  `relative inline-flex min-h-11 shrink-0 items-center px-1 text-[15px] font-bold transition-colors after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full ${
    ativa ? 'text-ink after:bg-teal' : 'text-muted hover:text-ink after:bg-transparent'
  }`

export default function Relatos() {
  const relatos = useRequisicao(() => listarRelatos('APROVADO'), [])
  const categorias = useRequisicao(listarCategorias, [])
  const regioes = useRequisicao(listarRegioes, [])

  // Os filtros ficam na URL: dá para compartilhar e o voltar do navegador funciona
  const [params, setParams] = useSearchParams()
  const categoriaId = idDaUrl(params.get('tipo'))
  const regiaoId = idDaUrl(params.get('regiao'))

  const filtrar = (chave: 'tipo' | 'regiao', id: number | null) => {
    const novos = new URLSearchParams(params)
    if (id === null) novos.delete(chave)
    else novos.set(chave, String(id))
    setParams(novos, { replace: true })
  }

  const filtrados = (relatos.dados ?? [])
    .filter((r) => categoriaId === null || r.categoriaId === categoriaId)
    .filter((r) => regiaoId === null || r.regiaoId === regiaoId)
    .sort((a, b) => b.dataOcorrencia.localeCompare(a.dataOcorrencia))

  const temFiltro = categoriaId !== null || regiaoId !== null

  return (
    <>
      <PageHeader titulo="Relatos" marco="pin">
        <p>Tudo o que passou pela moderação, do mais recente para o mais antigo.</p>
      </PageHeader>

      {/* Barra de filtros: regiões como abas de texto e o tipo num seletor simples */}
      <div className="entrar mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" style={{ '--i': 3 } as CSSProperties}>
        <div role="group" aria-label="Filtrar por região" className="faixa-rolavel -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <div className="flex w-max gap-5">
            <button type="button" aria-pressed={regiaoId === null} onClick={() => filtrar('regiao', null)} className={abaRegiao(regiaoId === null)}>
              Todas as regiões
            </button>
            {regioes.dados?.map((g) => (
              <button key={g.id} type="button" aria-pressed={regiaoId === g.id} onClick={() => filtrar('regiao', g.id)} className={abaRegiao(regiaoId === g.id)}>
                {g.nome}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 lg:shrink-0">
          <span className="text-[15px] font-bold text-muted">Tipo</span>
          {/* A seta fica presa ao seletor (não ao rótulo), em qualquer largura */}
          <span className="relative flex flex-1 sm:max-w-xs lg:w-60 lg:flex-none">
            <select
              value={categoriaId ?? ''}
              onChange={(e) => filtrar('tipo', e.target.value ? Number(e.target.value) : null)}
              className="min-h-11 w-full appearance-none rounded-full border border-line-strong bg-transparent py-2 pl-4 pr-10 text-[15px] font-bold text-ink transition-colors hover:border-ink"
            >
              <option value="">Todos os tipos</option>
              {categorias.dados?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </label>
      </div>

      {relatos.carregando && <Carregando texto="Buscando relatos" />}
      {relatos.erro && <MensagemErro titulo="Não foi possível carregar os relatos" mensagem={relatos.erro.message} onTentarNovamente={relatos.recarregar} />}
      {relatos.dados && filtrados.length === 0 && (
        <ListaVazia titulo={temFiltro ? 'Nenhum relato com esses filtros.' : 'Nenhum relato publicado ainda.'}>
          {temFiltro ? (
            <button type="button" onClick={() => setParams({}, { replace: true })} className="font-bold text-link underline underline-offset-4">
              Limpar filtros
            </button>
          ) : (
            <LinkBotao to="/enviar-relato">Enviar relato</LinkBotao>
          )}
        </ListaVazia>
      )}

      {filtrados.length > 0 && (
        <ul className="border-t border-line">
          {filtrados.map((r, i) => (
            <li key={r.id}>
              <ItemRelato relato={r} indice={i} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
