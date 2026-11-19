import type { CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoriaIcone from '../components/CategoriaIcone'
import { Carregando, ListaVazia, MensagemErro } from '../components/EstadoTela'
import PageHeader from '../components/PageHeader'
import { useRequisicao } from '../hooks/useRequisicao'
import { listarRelatos } from '../services/relatos'
import type { Relato, StatusRelato } from '../types/relato'
import { tempoDecorrido } from '../utils/formatar'

const abas: { status: StatusRelato; rotulo: string }[] = [
  { status: 'PENDENTE', rotulo: 'Pendentes' },
  { status: 'APROVADO', rotulo: 'Aprovados' },
  { status: 'REJEITADO', rotulo: 'Rejeitados' },
]

export default function Moderacao() {
  // A aba fica na URL (?status=APROVADO): recarregar ou compartilhar mantém a lista
  const [params, setParams] = useSearchParams()
  const status: StatusRelato = abas.find((a) => a.status === params.get('status'))?.status ?? 'PENDENTE'
  const setStatus = (s: StatusRelato) => setParams(s === 'PENDENTE' ? {} : { status: s }, { replace: true })
  // Busca todos uma vez (GET /relatos) para mostrar a contagem de cada aba
  const { dados, carregando, erro, recarregar } = useRequisicao(() => listarRelatos(), [])

  const fila = (dados ?? []).filter((r) => r.status === status).sort((a, b) => a.dataEnvio.localeCompare(b.dataEnvio))
  const contagem = (s: StatusRelato) => (dados ?? []).filter((r) => r.status === s).length

  const itemFila = (r: Relato) => (
    <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-start gap-3 border-b border-line py-4 pl-3">
      <span className="mt-0.5 grid size-7 place-items-center rounded-full bg-alert-bg text-alert-text">
        <CategoriaIcone nome={r.categoriaNome} className="size-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block font-bold leading-snug">{r.titulo}</span>
        <span className="mt-0.5 block text-sm text-muted">{r.regiaoNome}</span>
      </span>
      <span className="tabular pt-0.5 text-sm font-bold text-muted">{tempoDecorrido(r.dataEnvio)}</span>
    </div>
  )

  return (
    <>
      <PageHeader
        titulo="Moderação"
        marco="carimbo"
        lateral={
          dados && (
            <p className="lg:text-right" aria-live="polite">
              <span className="tabular block font-display text-5xl font-extrabold leading-none tracking-[-0.04em]">{contagem('PENDENTE')}</span>
              <span className="mt-1 block text-sm font-bold text-muted">esperando moderação</span>
            </p>
          )
        }
      >
        <p>Aprove o que ajuda outros pedestres. Rejeite com motivo o que não ajuda ou expõe alguém.</p>
      </PageHeader>

      <div role="group" aria-label="Filtrar por status" className="entrar faixa-rolavel -mx-4 mb-10 border-b border-line px-4 sm:mx-0 sm:px-0" style={{ '--i': 3 } as CSSProperties}>
        <div className="flex w-max gap-6">
          {abas.map((aba) => {
            const ativa = status === aba.status
            return (
              <button
                key={aba.status}
                type="button"
                aria-pressed={ativa}
                onClick={() => setStatus(aba.status)}
                className={`-mb-px flex min-h-12 items-center gap-2 border-b-2 px-1 text-[15px] font-bold transition-colors ${
                  ativa ? 'border-teal text-ink' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {aba.rotulo}
                {dados && <span className="tabular text-sm text-muted">{contagem(aba.status)}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {carregando && <Carregando texto="Buscando relatos" />}
      {erro && <MensagemErro titulo="Não foi possível carregar a fila" mensagem={erro.message} onTentarNovamente={recarregar} />}
      {dados && !carregando && fila.length === 0 && (
        <ListaVazia titulo={status === 'PENDENTE' ? 'Nenhum relato esperando moderação.' : 'Nenhum relato nesta lista.'}>
          {status === 'PENDENTE' && <p>Os novos relatos aparecem aqui assim que forem enviados.</p>}
        </ListaVazia>
      )}

      {dados && !carregando && fila.length > 0 && (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-0">
          <section aria-label={`Fila: ${abas.find((a) => a.status === status)?.rotulo}`} className="entrar lg:pr-12" style={{ '--i': 4 } as CSSProperties}>
            <p className="mb-2 text-sm font-bold text-muted">Mais antigos primeiro</p>
            <ul className="border-t border-line">
              {fila.map((r) => (
                <li key={r.id}>{itemFila(r)}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </>
  )
}
