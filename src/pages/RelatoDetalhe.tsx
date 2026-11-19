import type { CSSProperties, ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LinkBotao } from '../components/Button'
import CategoriaIcone from '../components/CategoriaIcone'
import { Carregando, ListaVazia, MensagemErro } from '../components/EstadoTela'
import ItemRelato from '../components/ItemRelato'
import MapaPrevia from '../components/MapaPrevia'
import StatusBadge from '../components/StatusBadge'
import { useRequisicao } from '../hooks/useRequisicao'
import { buscarRelato, listarRelatosDaRegiao } from '../services/relatos'
import type { Relato } from '../types/relato'
import { formatarDataHora, tempoDecorrido } from '../utils/formatar'

/** Atalho para escalonar a animação de entrada. */
const ordem = (i: number) => ({ '--i': i }) as CSSProperties

/** Voltar para a lista: link de verdade (abre em nova aba, funciona sem histórico). */
function Voltar() {
  return (
    <Link to="/relatos" className="entrar group mb-10 inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-muted hover:text-ink">
      <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Relatos
    </Link>
  )
}

/** Um dado da ficha: rótulo pequeno em cima, valor embaixo. */
function Dado({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-4">
      <dt className="text-sm font-bold text-muted">{rotulo}</dt>
      <dd className="mt-1.5 text-[17px] text-ink">{children}</dd>
    </div>
  )
}

/** Outros relatos aprovados da mesma região: a página não termina num beco sem saída. */
function MaisDaRegiao({ relato }: { relato: Relato }) {
  const { dados } = useRequisicao(() => listarRelatosDaRegiao(relato.regiaoId), [relato.regiaoId])
  const outros = (dados ?? []).filter((r) => r.id !== relato.id).slice(0, 3)
  if (outros.length === 0) return null

  return (
    <section aria-labelledby="mais-regiao" className="mt-20">
      <div className="entrar flex flex-wrap items-end justify-between gap-4" style={ordem(8)}>
        <h2 id="mais-regiao" className="text-[clamp(1.5rem,2.5vw,2rem)]">
          Também em {relato.regiaoNome}
        </h2>
      </div>
      <ul className="mt-4 border-t border-line">
        {outros.map((r, i) => (
          <li key={r.id}>
            <ItemRelato relato={r} indice={9 + i} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Detalhe do relato (rota com parâmetro /relatos/:id). */
export default function RelatoDetalhe() {
  const { id } = useParams<{ id: string }>()
  const idNumero = Number(id)
  const idValido = Number.isInteger(idNumero) && idNumero > 0

  const { dados: relato, carregando, erro, recarregar } = useRequisicao(
    () => (idValido ? buscarRelato(idNumero) : Promise.reject(new Error('id inválido'))),
    [idNumero],
  )

  if (!idValido || erro?.status === 404) {
    return (
      <>
        <Voltar />
        <ListaVazia titulo="Este relato não existe ou foi removido.">
          <p className="mb-4">A moderação pode ter tirado o relato do mapa.</p>
          <LinkBotao to="/relatos" variante="neutro">
            Ver todos os relatos
          </LinkBotao>
        </ListaVazia>
      </>
    )
  }

  return (
    <article>
      <Voltar />
      {carregando && <Carregando texto="Abrindo relato" formato="bloco" />}
      {erro && <MensagemErro titulo="Não foi possível abrir o relato" mensagem={erro.message} onTentarNovamente={recarregar} />}

      {relato && !carregando && (
        <>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
            {/* Leitura: categoria, título, descrição e a ficha */}
            <div className="min-w-0">
              <p className="entrar flex flex-wrap items-center gap-x-4 gap-y-2" style={ordem(0)}>
                <span className="inline-flex items-center gap-2 text-[15px] font-bold text-alert-text">
                  <CategoriaIcone nome={relato.categoriaNome} className="size-4" />
                  {relato.categoriaNome}
                </span>
                <StatusBadge status={relato.status} />
              </p>
              <h1 className="entrar mt-5 max-w-3xl text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.035em]" style={ordem(1)}>
                {relato.titulo}
              </h1>
              <p className="entrar mt-6 max-w-2xl text-xl leading-relaxed text-ink-2" style={ordem(2)}>
                {relato.descricao}
              </p>

              <dl className="entrar mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-3" style={ordem(3)}>
                <Dado rotulo="Onde">
                  {relato.logradouro}
                  <span className="block text-[15px] text-muted">{relato.regiaoNome}</span>
                </Dado>
                <Dado rotulo="Quando aconteceu">
                  {formatarDataHora(relato.dataOcorrencia)}
                  <span className="block text-[15px] text-muted">{tempoDecorrido(relato.dataOcorrencia)}</span>
                </Dado>
                <Dado rotulo="Enviado em">{formatarDataHora(relato.dataEnvio)}</Dado>
              </dl>

              {relato.tags.length > 0 && (
                <p className="entrar mt-8 flex flex-wrap gap-x-4 gap-y-1 text-[15px] font-bold text-muted" style={ordem(4)}>
                  {relato.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </p>
              )}

              {relato.motivoRejeicao && (
                <div className="entrar mt-8 border-l-2 border-alert pl-4" style={ordem(4)}>
                  <p className="text-sm font-bold text-alert-text">Motivo da rejeição</p>
                  <p className="mt-1 text-ink-2">{relato.motivoRejeicao}</p>
                </div>
              )}
            </div>

            {/* Lado: onde fica (mapa) e a nota de anonimato, discreta */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <div className="entrar" style={ordem(3)}>
                <MapaPrevia relatos={[relato]} selecionadoId={relato.id} />
              </div>
              <p className="entrar flex gap-3 text-[15px] text-muted" style={ordem(4)}>
                {/* Olho riscado: quem enviou não aparece */}
                <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-link" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 3l18 18" />
                  <path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c5.5 0 9 5.5 9 7a12 12 0 0 1-2.6 3.4M6.2 6.2C4 7.6 3 10.5 3 12c0 1.5 3.5 7 9 7a9.6 9.6 0 0 0 4.6-1.2" />
                  <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                </svg>
                <span>
                  <strong className="block text-ink">Quem enviou não aparece em lugar nenhum.</strong>
                  O relato não guarda nome, e-mail nem IP. Nem a moderação sabe quem foi.
                </span>
              </p>
            </aside>
          </div>

          <MaisDaRegiao relato={relato} />
        </>
      )}
    </article>
  )
}
