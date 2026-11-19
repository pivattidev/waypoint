import type { ErroApi } from '../types/api'

export class ApiError extends Error {
  status: number
  erro: string
  caminho: string

  constructor(dados: ErroApi) {
    super(dados.mensagem)
    this.name = 'ApiError'
    this.status = dados.status
    this.erro = dados.erro
    this.caminho = dados.caminho
  }
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiError) return erro.message
  return 'Algo deu errado. Tente novamente em instantes.'
}
