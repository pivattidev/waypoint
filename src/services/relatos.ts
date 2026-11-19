import type { ModeracaoRelato, NovoRelato, Relato, StatusRelato } from '../types/relato'
import { categoriasMock, regioesMock } from './mock/dados'
import { bancoMock, falhar, responder } from './mock/servidor'

/** GET /relatos?status= */
export function listarRelatos(status?: StatusRelato): Promise<Relato[]> {
  return responder(bancoMock.relatos.filter((r) => !status || r.status === status))
}

/** GET /regioes/{id}/relatos?status=APROVADO */
export function listarRelatosDaRegiao(regiaoId: number, status: StatusRelato = 'APROVADO'): Promise<Relato[]> {
  const caminho = `/regioes/${regiaoId}/relatos`
  if (!regioesMock.some((g) => g.id === regiaoId)) {
    return falhar(404, 'Não encontrado', 'Região não encontrada.', caminho)
  }
  return responder(bancoMock.relatos.filter((r) => r.regiaoId === regiaoId && r.status === status))
}

/** GET /relatos/{id} */
export function buscarRelato(id: number): Promise<Relato> {
  const encontrado = bancoMock.relatos.find((r) => r.id === id)
  if (!encontrado) return falhar(404, 'Não encontrado', 'Relato não encontrado.', `/relatos/${id}`)
  return responder(encontrado)
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
