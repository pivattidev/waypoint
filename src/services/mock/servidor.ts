// Simula a API Java em memória, com atraso e os mesmos erros do contrato (404, 409).
import { ApiError } from '../api'
import type { Relato } from '../../types/relato'
import { relatosMock } from './dados'

const ATRASO_MS = 250 // latência simulada da API (curta: só para o "carregando" aparecer)

/** Cópia mutável: POST, PATCH e DELETE funcionam até recarregar a página. */
export const bancoMock: { relatos: Relato[]; proximoId: number } = {
  relatos: structuredClone(relatosMock),
  proximoId: Math.max(...relatosMock.map((r) => r.id)) + 1,
}

export function responder<T>(dados: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(dados)), ATRASO_MS))
}

export function falhar(status: number, erro: string, mensagem: string, caminho: string): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new ApiError({ status, erro, mensagem, caminho })), ATRASO_MS),
  )
}