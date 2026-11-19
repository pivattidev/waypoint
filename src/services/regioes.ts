import type { CategoriaJava } from '../types/java'
import type { Categoria, Regiao } from '../types/regiao'
import { categoriaDoJava } from '../utils/conversaoJava'
import { requisicao } from './api'

/**
 * Regiões atendidas pelo site. A API Java não tem tabela de região:
 * a região de um relato é o BAIRRO do trecho dele (comparado pelo nome).
 * latitude/longitude = centro aproximado do bairro, usado para posicionar os pins.
 */
export const REGIOES: Regiao[] = [
  { id: 1, nome: 'Bela Vista', cidade: 'São Paulo', latitude: -23.5614, longitude: -46.656 },
  { id: 2, nome: 'Consolação', cidade: 'São Paulo', latitude: -23.5567, longitude: -46.6588 },
  { id: 3, nome: 'Liberdade', cidade: 'São Paulo', latitude: -23.5615, longitude: -46.6365 },
  { id: 4, nome: 'Pinheiros', cidade: 'São Paulo', latitude: -23.561, longitude: -46.6815 },
  { id: 5, nome: 'República', cidade: 'São Paulo', latitude: -23.543, longitude: -46.6425 },
  { id: 6, nome: 'Vila Mariana', cidade: 'São Paulo', latitude: -23.583, longitude: -46.637 },
]

/** As regiões são fixas, mas a função continua assíncrona: as páginas usam igual a uma chamada da API. */
export function listarRegioes(): Promise<Regiao[]> {
  return Promise.resolve(REGIOES)
}

/** GET /categoria */
export async function listarCategorias(): Promise<Categoria[]> {
  const categorias = await requisicao<CategoriaJava[]>('/categoria')
  return categorias.map(categoriaDoJava)
}
