import type { CategoriaJava, NovoTrechoJava, RelatoJava, RelatoJavaEntrada, TrechoJava } from '../types/java'
import type { ModeracaoRelato, NovoRelato, Relato, StatusRelato } from '../types/relato'
import { STATUS_PARA_JAVA, dataParaJava, juntarTexto, relatoDoJava } from '../utils/conversaoJava'
import { ApiError, requisicao } from './api'
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

/** O Java exige um usuário em todo relato. O site usa sempre o usuário "Anônimo" (id 20 no banco): ninguém é identificado. */
const USUARIO_ANONIMO_ID = 20

/**
 * Envio em 2 passos, porque no Java o relato aponta para um trecho que já existe:
 * POST /trecho → id do trecho · POST /relato com esse id → id do relato (201).
 */
export async function enviarRelato(regiaoId: number, dados: NovoRelato): Promise<Relato> {
  const regiao = REGIOES.find((r) => r.id === regiaoId)
  if (!regiao) {
    throw new ApiError({ status: 400, erro: 'Região inválida', mensagem: 'Escolha uma região da lista.', caminho: '/trecho' })
  }

  // Posição aproximada: um ponto sorteado perto do centro do bairro (não expõe o local exato de quem relata)
  const latitude = regiao.latitude + (Math.random() - 0.5) * 0.008
  const longitude = regiao.longitude + (Math.random() - 0.5) * 0.008
  const trecho: NovoTrechoJava = { logradouro: dados.logradouro, bairro: regiao.nome, latitude, longitude }
  const idTrecho = await requisicao<number>('/trecho', { method: 'POST', body: JSON.stringify(trecho) })

  const relato: RelatoJavaEntrada = {
    descricao: juntarTexto(dados.titulo, dados.descricao),
    dataRelato: dataParaJava(dados.dataOcorrencia),
    status: STATUS_PARA_JAVA.PENDENTE,
    usuario: { id: USUARIO_ANONIMO_ID },
    trecho: { idTrecho },
    categoria: { idCategoria: dados.categoriaId },
  }
  const idRelato = await requisicao<number>('/relato', { method: 'POST', body: JSON.stringify(relato) })

  return {
    ...dados,
    id: idRelato,
    regiaoId,
    regiaoNome: regiao.nome,
    categoriaNome: '',
    latitude,
    longitude,
    dataEnvio: dados.dataOcorrencia,
    status: 'PENDENTE',
    motivoRejeicao: null,
    tags: [],
  }
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
