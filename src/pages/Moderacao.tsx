import { useState, type CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'
import { AreaTexto } from '../components/Campo'
import CategoriaIcone from '../components/CategoriaIcone'
import { Carregando, ListaVazia, MensagemErro } from '../components/EstadoTela'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useMidia } from '../hooks/useMidia'
import { useRequisicao } from '../hooks/useRequisicao'
import { mensagemDeErro } from '../services/api'
import { excluirRelato, listarRelatos, moderarRelato } from '../services/relatos'
import type { Relato, StatusRelato } from '../types/relato'
import { formatarDataHora, tempoDecorrido } from '../utils/formatar'

// TODO: sem login por enquanto. O moderador fixo é o cd_moderador 1 do script SQL.
const MODERADOR_ID = 1

const abas: { status: StatusRelato; rotulo: string }[] = [
  { status: 'PENDENTE', rotulo: 'Pendentes' },
  { status: 'APROVADO', rotulo: 'Aprovados' },
  { status: 'REJEITADO', rotulo: 'Rejeitados' },
]

type Acao = 'aprovar' | 'rejeitar' | 'excluir'

interface FichaProps {
  relato: Relato
  /** Mensagem de sucesso + se o relato saiu da fila atual. */
  onConcluir: (mensagem: string) => void
}

/** Ficha de moderação: lê o relato inteiro e decide. Só PENDENTE pode ser moderado (regra do Java: senão 409). */
function Ficha({ relato, onConcluir }: FichaProps) {
  const [modo, setModo] = useState<'ler' | 'rejeitar' | 'excluir'>('ler')
  const [motivo, setMotivo] = useState('')
  const [acao, setAcao] = useState<Acao | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const executar = async (tipo: Acao) => {
    if (tipo === 'rejeitar' && motivo.trim().length < 10) {
      setErro('Explique o motivo em pelo menos 10 letras. Ele fica registrado no relato.')
      return
    }
    setAcao(tipo)
    setErro(null)
    try {
      if (tipo === 'excluir') {
        await excluirRelato(relato.id)
        onConcluir('Relato excluído.')
      } else {
        await moderarRelato(relato.id, {
          status: tipo === 'aprovar' ? 'APROVADO' : 'REJEITADO',
          moderadorId: MODERADOR_ID,
          motivoRejeicao: tipo === 'rejeitar' ? motivo.trim() : undefined,
        })
        onConcluir(tipo === 'aprovar' ? 'Relato aprovado e publicado no mapa.' : 'Relato rejeitado. O motivo ficou registrado.')
      }
    } catch (e) {
      // 409 "Este relato já foi moderado." e outros erros chegam com a mensagem do Java
      setErro(mensagemDeErro(e))
      setAcao(null)
    }
  }

  return (
    <article className="entrar relative" aria-labelledby={`ficha-${relato.id}`}>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-2 text-[15px] font-bold text-alert-text">
          <CategoriaIcone nome={relato.categoriaNome} className="size-4" />
          {relato.categoriaNome}
        </span>
        <StatusBadge status={relato.status} />
      </p>
      <h2 id={`ficha-${relato.id}`} className="mt-4 max-w-2xl text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
        <Link to={`/relatos/${relato.id}`} className="decoration-2 underline-offset-4 hover:text-link hover:underline">
          {relato.titulo}
        </Link>
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{relato.descricao}</p>
      <dl className="mt-8 grid gap-x-8 gap-y-4 text-[15px] sm:grid-cols-2 [&>div]:border-t [&>div]:border-line [&>div]:pt-3">
        <div>
          <dt className="font-bold text-muted">Local</dt>
          <dd>
            {relato.logradouro}, {relato.regiaoNome}
          </dd>
        </div>
        <div>
          <dt className="font-bold text-muted">Enviado</dt>
          <dd>{formatarDataHora(relato.dataEnvio)}</dd>
        </div>
      </dl>
      {relato.motivoRejeicao && (
        <p className="mt-6 border-l-2 border-alert pl-4 text-[15px] text-ink-2">
          <strong className="text-alert-text">Motivo da rejeição:</strong> {relato.motivoRejeicao}
        </p>
      )}

      {erro && (
        <p role="alert" className="mt-6 border-l-2 border-alert pl-4 font-bold text-alert-text">
          {erro}
        </p>
      )}

      {modo === 'rejeitar' && (
        <div className="entrar mt-6">
          <label htmlFor={`motivo-${relato.id}`} className="mb-1.5 block text-[15px] font-bold">
            Motivo da rejeição (obrigatório)
          </label>
          <AreaTexto id={`motivo-${relato.id}`} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </div>
      )}

      {modo === 'excluir' && (
        <p role="alert" className="entrar mt-6 border-l-2 border-alert pl-4 font-bold text-alert-text">
          Excluir de vez? Não dá para desfazer.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {modo === 'ler' && (
          <>
            {relato.status === 'PENDENTE' && (
              <>
                <Button onClick={() => executar('aprovar')} carregando={acao === 'aprovar'} disabled={acao !== null}>
                  Aprovar
                </Button>
                <Button variante="neutro" onClick={() => setModo('rejeitar')} disabled={acao !== null}>
                  Rejeitar
                </Button>
              </>
            )}
            <Button variante="fantasma" className="ml-auto" onClick={() => setModo('excluir')} disabled={acao !== null}>
              Excluir
            </Button>
          </>
        )}
        {modo === 'rejeitar' && (
          <>
            <Button variante="perigo" onClick={() => executar('rejeitar')} carregando={acao === 'rejeitar'}>
              Confirmar rejeição
            </Button>
            <Button variante="neutro" onClick={() => setModo('ler')} disabled={acao !== null}>
              Cancelar
            </Button>
          </>
        )}
        {modo === 'excluir' && (
          <>
            <Button variante="perigo" onClick={() => executar('excluir')} carregando={acao === 'excluir'}>
              Excluir de vez
            </Button>
            <Button variante="neutro" onClick={() => setModo('ler')} disabled={acao !== null}>
              Cancelar
            </Button>
          </>
        )}
      </div>
    </article>
  )
}

export default function Moderacao() {
  // A aba fica na URL (?status=APROVADO): recarregar ou compartilhar mantém a lista
  const [params, setParams] = useSearchParams()
  const status: StatusRelato = abas.find((a) => a.status === params.get('status'))?.status ?? 'PENDENTE'
  const setStatus = (s: StatusRelato) => setParams(s === 'PENDENTE' ? {} : { status: s }, { replace: true })
  const [aviso, setAviso] = useState<string | null>(null)
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null)
  const desktop = useMidia('(min-width: 1024px)')
  // Busca todos uma vez (GET /relatos) para mostrar a contagem de cada aba
  const { dados, carregando, erro, recarregar } = useRequisicao(() => listarRelatos(), [])

  const fila = (dados ?? []).filter((r) => r.status === status).sort((a, b) => a.dataEnvio.localeCompare(b.dataEnvio))
  const contagem = (s: StatusRelato) => (dados ?? []).filter((r) => r.status === s).length
  // No desktop sempre há uma ficha aberta: a escolhida ou, se nenhuma, a primeira da fila (a mais antiga)
  const selecionado = fila.find((r) => r.id === selecionadoId) ?? (desktop ? (fila[0] ?? null) : null)

  const concluir = (mensagem: string) => {
    setAviso(mensagem)
    setSelecionadoId(null)
    recarregar()
  }

  const itemFila = (r: Relato) => {
    const ativo = r.id === selecionado?.id
    return (
      <button
        type="button"
        onClick={() => setSelecionadoId(ativo && !desktop ? null : r.id)}
        aria-expanded={desktop ? undefined : ativo}
        aria-pressed={desktop ? ativo : undefined}
        // Selecionado: barra teal à esquerda e título em teal (o mesmo padrão do Mapa)
        className={`group grid w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] items-start gap-3 border-b border-l-2 border-b-line py-4 pl-3 text-left transition-colors duration-150 ${
          ativo ? 'border-l-teal' : 'border-l-transparent hover:border-l-line-strong'
        }`}
      >
        <span className="mt-0.5 grid size-7 place-items-center rounded-full bg-alert-bg text-alert-text">
          <CategoriaIcone nome={r.categoriaNome} className="size-3.5" />
        </span>
        <span className="min-w-0">
          <span className={`block font-bold leading-snug transition-colors ${ativo ? 'text-link' : 'group-hover:text-link'}`}>{r.titulo}</span>
          <span className="mt-0.5 block text-sm text-muted">{r.regiaoNome}</span>
        </span>
        <span className="tabular pt-0.5 text-sm font-bold text-muted">{tempoDecorrido(r.dataEnvio)}</span>
      </button>
    )
  }

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
                onClick={() => {
                  setStatus(aba.status)
                  setSelecionadoId(null)
                  setAviso(null)
                }}
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

      {aviso && (
        <p role="status" className="entrar mb-8 max-w-3xl border-l-2 border-teal pl-4 font-bold">
          {aviso}
        </p>
      )}

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
                <li key={r.id}>
                  {itemFila(r)}
                  {/* Celular e tablet: a ficha abre logo abaixo do item (acordeão) */}
                  {!desktop && r.id === selecionado?.id && (
                    <div className="border-b border-l-2 border-b-line border-l-teal py-6 pl-4">
                      <Ficha key={r.id} relato={r} onConcluir={concluir} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
          {desktop && selecionado && (
            <div className="sticky top-28 min-h-[50vh] border-l border-line pl-12">
              <Ficha key={selecionado.id} relato={selecionado} onConcluir={concluir} />
            </div>
          )}
        </div>
      )}
    </>
  )
}
