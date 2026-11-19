// Interfaces espelham os DTOs de resposta da API Java, com os mesmos campos em camelCase.
// Ajustar em breve

export type StatusRelato = 'PENDENTE' | 'APROVADO' | 'REJEITADO'

export interface Relato {
  id: number
  regiaoId: number
  regiaoNome: string
  categoriaId: number
  categoriaNome: string
  titulo: string
  descricao: string
  logradouro: string
  latitude: number
  longitude: number
  dataOcorrencia: string // yyyy-MM-dd'T'HH:mm
  dataEnvio: string
  status: StatusRelato
  motivoRejeicao: string | null
  tags: string[]
}

/** Dados do formulário de envio. Não leva nada de quem enviou: o relato é anônimo. */
export interface NovoRelato {
  categoriaId: number
  titulo: string
  descricao: string
  logradouro: string
  dataOcorrencia: string // aaaa-mm-dd (o Java guarda só a data)
}

/** Corpo do PATCH /relatos/{id}/moderacao. */
export interface ModeracaoRelato {
  status: Exclude<StatusRelato, 'PENDENTE'>
  moderadorId: number
  motivoRejeicao?: string
}
