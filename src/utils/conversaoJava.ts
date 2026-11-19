import type { CategoriaJava, RelatoJava, TrechoJava } from '../types/java'
import type { Categoria, Regiao } from '../types/regiao'
import type { Relato, StatusRelato } from '../types/relato'

/**
 * Status do site → status gravado no banco (a coluna aceita no máximo 7 letras).
 * Os relatos que já estavam no banco usam ATIVO e INATIVO; o pendente da moderação é ABERTO.
 */
export const STATUS_PARA_JAVA: Record<StatusRelato, string> = {
  PENDENTE: 'ABERTO',
  APROVADO: 'ATIVO',
  REJEITADO: 'INATIVO',
}

/** Status do Java → status do site. Qualquer valor desconhecido conta como pendente. */
export function statusDoJava(status: string): StatusRelato {
  const valor = status.trim().toUpperCase()
  const achado = (Object.keys(STATUS_PARA_JAVA) as StatusRelato[]).find((s) => STATUS_PARA_JAVA[s] === valor)
  return achado ?? 'PENDENTE'
}

/** "18/11/2026" (Java) → "2026-11-18" (site) */
export function dataDoJava(data: string): string {
  const [dia, mes, ano] = data.split('/')
  return `${ano}-${mes}-${dia}`
}

/** "2026-11-18" (site) → "18/11/2026" (Java) */
export function dataParaJava(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

/**
 * O Java não tem coluna de título. Guardamos os dois juntos no campo descricao:
 * a primeira linha é o título e o resto é a descrição.
 */
export function juntarTexto(titulo: string, descricao: string): string {
  return `${titulo}\n${descricao}`
}

export function separarTexto(texto: string): { titulo: string; descricao: string } {
  const quebra = texto.indexOf('\n')
  if (quebra === -1) return { titulo: texto, descricao: '' }
  return { titulo: texto.slice(0, quebra), descricao: texto.slice(quebra + 1) }
}

/** Compara nomes sem acento e sem maiúsculas ("Vila Mariana" = "vila mariana"). */
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()

export function categoriaDoJava(categoria: CategoriaJava): Categoria {
  return { id: categoria.idCategoria, nome: categoria.nome, descricao: categoria.descricao ?? '' }
}

/**
 * Junta o relato com o trecho e a categoria dele e devolve no formato que as páginas usam.
 * A região é o bairro do trecho. Tags e motivo da rejeição não existem no Java.
 */
export function relatoDoJava(relato: RelatoJava, trechos: TrechoJava[], categorias: CategoriaJava[], regioes: Regiao[]): Relato {
  const trecho = trechos.find((t) => t.idTrecho === relato.trecho.idTrecho)
  const categoria = categorias.find((c) => c.idCategoria === relato.categoria.idCategoria)
  const regiao = trecho ? regioes.find((r) => normalizar(r.nome) === normalizar(trecho.bairro)) : undefined
  const { titulo, descricao } = separarTexto(relato.descricao)
  const data = dataDoJava(relato.dataRelato)

  return {
    id: relato.idRelato,
    regiaoId: regiao?.id ?? 0,
    regiaoNome: regiao?.nome ?? trecho?.bairro ?? '',
    categoriaId: relato.categoria.idCategoria,
    categoriaNome: categoria?.nome ?? '',
    titulo,
    descricao,
    logradouro: trecho?.logradouro ?? '',
    latitude: trecho?.latitude ?? regiao?.latitude ?? regioes[0].latitude,
    longitude: trecho?.longitude ?? regiao?.longitude ?? regioes[0].longitude,
    dataOcorrencia: data,
    dataEnvio: data,
    status: statusDoJava(relato.status),
    motivoRejeicao: null,
    tags: [],
  }
}
