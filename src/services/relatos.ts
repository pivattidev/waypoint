import type { CategoriaJava, NovoTrechoJava, RelatoJava, RelatoJavaEntrada, TrechoJava } from '../types/java'
import type { ModeracaoRelato, NovoRelato, Relato, StatusRelato } from '../types/relato'
import { STATUS_PARA_JAVA, dataParaJava, juntarTexto, relatoDoJava } from '../utils/conversaoJava'
import { ApiError, requisicao } from './api'
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

/**
 * O PUT do Java regrava o relato INTEIRO. Então buscamos o relato como está no banco,
 * trocamos só o status e mandamos de volta.
 */
export async function moderarRelato(id: number, dados: ModeracaoRelato): Promise<void> {
  const atual = await requisicao<RelatoJava>(`/relato/${id}`)
  const corpo: RelatoJavaEntrada = {
    descricao: atual.descricao,
    dataRelato: atual.dataRelato,
    status: STATUS_PARA_JAVA[dados.status],
    usuario: { id: atual.usuario.id },
    trecho: { idTrecho: atual.trecho.idTrecho },
    categoria: { idCategoria: atual.categoria.idCategoria },
  }
  await requisicao<string>(`/relato/${id}`, { method: 'PUT', body: JSON.stringify(corpo) })
}

/** DELETE /relato/{id} → 204 */
export async function excluirRelato(id: number): Promise<void> {
  await requisicao<void>(`/relato/${id}`, { method: 'DELETE' })
}
