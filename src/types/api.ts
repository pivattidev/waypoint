/** Formato padrão de erro devolvido pelo @RestControllerAdvice do Java. */
export interface ErroApi {
  status: number
  erro: string
  mensagem: string
  caminho: string
}
