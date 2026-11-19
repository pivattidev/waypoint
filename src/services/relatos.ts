import type { Relato, StatusRelato } from '../types/relato'
import { regioesMock } from './mock/dados'
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
