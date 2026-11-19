import type { ErroApi } from '../types/api'

/** Endereço da API Java, lido do arquivo .env (VITE_API_URL). Tira a barra do final, se tiver. */
const API_URL = (import.meta.env.VITE_API_URL ?? 'https://waypoint-api-k9vs.onrender.com/').replace(/\/$/, '')

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

/**
 * Wrapper do fetch: monta a URL, envia JSON e transforma qualquer falha em ApiError.
 * A API Java responde os erros em TEXTO (ex.: "Erro: Descricao: preencha de 1 a 100 caracteres."),
 * então esse texto vira a mensagem mostrada na tela.
 */
export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  let resposta: Response

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      // Content-Type só quando há corpo (POST e PUT)
      headers: opcoes.body ? { 'Content-Type': 'application/json', ...opcoes.headers } : opcoes.headers,
    })
  } catch {
    throw new ApiError({
      status: 0,
      erro: 'Sem conexão',
      mensagem: 'Não conseguimos falar com o servidor. Confira sua internet e tente de novo.',
      caminho,
    })
  }

  const texto = await resposta.text()

  if (!resposta.ok) {
    throw new ApiError({
      status: resposta.status,
      erro: resposta.statusText,
      mensagem: texto.trim() || (resposta.status === 404 ? 'Não encontramos o que você procurou.' : 'Algo deu errado. Tente novamente em instantes.'),
      caminho,
    })
  }

  // 204 (DELETE) vem sem corpo; o PUT do Java responde uma frase em texto, e o resto vem em JSON
  if (!texto) return undefined as T
  const ehJson = resposta.headers.get('Content-Type')?.includes('json')
  return (ehJson ? JSON.parse(texto) : texto) as T
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiError) return erro.message
  return 'Algo deu errado. Tente novamente em instantes.'
}
