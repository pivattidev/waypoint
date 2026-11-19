import type { CategoriaJava, RelatoJava, TrechoJava } from '../types/java'
import type { ModeracaoRelato, NovoRelato, Relato, StatusRelato } from '../types/relato'
import { relatoDoJava } from '../utils/conversaoJava'
import { requisicao } from './api'
import { categoriasMock, regioesMock } from './mock/dados'
import { bancoMock, falhar, responder } from './mock/servidor'
import { REGIOES } from './regioes'

/**
 * O GET /relato devolve trecho e categoria só com o id. Então buscamos as três listas
 * ao mesmo tempo (Promise.all) e juntamos tudo no formato que as páginas usam.
 */
async function buscarTodos(): Promise<Relato[]> {
  const [relatos, trechos, categorias] = await Promise.all([
    requisicao<RelatoJava[]>('/relato'),
    requisicao<TrechoJava[]>('/trecho'),
    requisicao<CategoriaJava[]>('/categoria'),
  ])
  return relatos.map((r) => relatoDoJava(r, trechos, categorias, REGIOES))
}

/** GET /relato. O Java devolve todos; o filtro por status é feito aqui. */
export async function listarRelatos(status?: StatusRelato): Promise<Relato[]> {
  const todos = await buscarTodos()
  return todos.filter((r) => !status || r.status === status)
}

/** Relatos de uma região (bairro do trecho), só os aprovados por padrão. */
export async function listarRelatosDaRegiao(regiaoId: number, status: StatusRelato = 'APROVADO'): Promise<Relato[]> {
  const todos = await buscarTodos()
  return todos.filter((r) => r.regiaoId === regiaoId && r.status === status)
}

/** GET /relato/{id}, depois o trecho e a categoria dele. */
export async function buscarRelato(id: number): Promise<Relato> {
  const relato = await requisicao<RelatoJava>(`/relato/${id}`)
  const [trecho, categoria] = await Promise.all([
    requisicao<TrechoJava>(`/trecho/${relato.trecho.idTrecho}`),
    requisicao<CategoriaJava>(`/categoria/${relato.categoria.idCategoria}`),
  ])
  return relatoDoJava(relato, [trecho], [categoria], REGIOES)
}

/** POST /regioes/{id}/relatos → 201 */
export function enviarRelato(regiaoId: number, dados: NovoRelato): Promise<Relato> {
  const regiao = regioesMock.find((g) => g.id === regiaoId)
  if (!regiao) return falhar(404, 'Não encontrado', 'Região não encontrada.', `/regioes/${regiaoId}/relatos`)
  const novo: Relato = {
    ...dados,
    id: bancoMock.proximoId++,
    regiaoId,
    regiaoNome: regiao.nome,
    categoriaNome: categoriasMock.find((c) => c.id === dados.categoriaId)?.nome ?? '',
    latitude: dados.latitude ?? regiao.latitude,
    longitude: dados.longitude ?? regiao.longitude,
    dataEnvio: new Date().toISOString().slice(0, 16),
    status: 'PENDENTE',
    motivoRejeicao: null,
  }
  bancoMock.relatos.push(novo)
  return responder(novo)
}

/** PATCH /relatos/{id}/moderacao → 200 · 409 se já moderado */
export function moderarRelato(id: number, dados: ModeracaoRelato): Promise<Relato> {
  const caminho = `/relatos/${id}/moderacao`
  const alvo = bancoMock.relatos.find((r) => r.id === id)
  if (!alvo) return falhar(404, 'Não encontrado', 'Relato não encontrado.', caminho)
  if (alvo.status !== 'PENDENTE') return falhar(409, 'Conflito', 'Este relato já foi moderado.', caminho)
  alvo.status = dados.status
  alvo.motivoRejeicao = dados.motivoRejeicao ?? null
  return responder(alvo)
}

/** DELETE /relatos/{id} → 204 */
export function excluirRelato(id: number): Promise<void> {
  const indice = bancoMock.relatos.findIndex((r) => r.id === id)
  if (indice === -1) return falhar(404, 'Não encontrado', 'Relato não encontrado.', `/relatos/${id}`)
  bancoMock.relatos.splice(indice, 1)
  return responder(undefined)
}
