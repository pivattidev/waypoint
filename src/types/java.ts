// Formatos EXATOS que a API Java (Spring Boot) recebe e devolve, com os mesmos nomes de campo.
// As páginas não usam estes tipos: utils/conversaoJava.ts traduz para Relato, Regiao e Categoria.

export interface CategoriaJava {
  idCategoria: number
  nome: string
  descricao: string | null
}

/** Trecho = o local do relato: rua, bairro e coordenadas. */
export interface TrechoJava {
  idTrecho: number
  logradouro: string
  bairro: string
  latitude: number
  longitude: number
}

/** O GET /relato devolve usuário, trecho e categoria só com o id. */
export interface RelatoJava {
  idRelato: number
  dataRelato: string // dd/MM/aaaa
  descricao: string
  status: string
  usuario: { id: number }
  trecho: { idTrecho: number }
  categoria: { idCategoria: number }
}

/** Corpo do POST /trecho (o id é gerado pelo Oracle). */
export type NovoTrechoJava = Omit<TrechoJava, 'idTrecho'>

/** Corpo do POST /relato e do PUT /relato/{id}. */
export type RelatoJavaEntrada = Omit<RelatoJava, 'idRelato'>
