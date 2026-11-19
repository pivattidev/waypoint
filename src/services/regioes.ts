import type { Categoria, Regiao } from '../types/regiao'
import { categoriasMock, regioesMock } from './mock/dados'
import { responder } from './mock/servidor'

/** GET /regioes */
export function listarRegioes(): Promise<Regiao[]> {
  return responder(regioesMock)
}

/** GET /categorias */
export function listarCategorias(): Promise<Categoria[]> {
  return responder(categoriasMock)
}
