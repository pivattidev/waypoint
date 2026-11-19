// DADOS DE TESTE — no formato exato do contrato com a API Java.
// Servem para desenvolver as telas antes da API ficar pronta. Apagar os mocks quanddo integrar a API
import type { Categoria, Regiao } from '../../types/regiao'

export const regioesMock: Regiao[] = [
  { id: 1, nome: 'Centro', cidade: 'São Paulo', latitude: -23.5505, longitude: -46.6333 },
  { id: 2, nome: 'Paulista', cidade: 'São Paulo', latitude: -23.5614, longitude: -46.6559 },
  { id: 3, nome: 'Pinheiros', cidade: 'São Paulo', latitude: -23.567, longitude: -46.692 },
  { id: 4, nome: 'Vila Mariana', cidade: 'São Paulo', latitude: -23.589, longitude: -46.634 },
  { id: 5, nome: 'Mooca', cidade: 'São Paulo', latitude: -23.56, longitude: -46.599 },
]

export const categoriasMock: Categoria[] = [
  { id: 1, nome: 'Iluminação precária', descricao: 'Postes apagados ou trechos escuros' },
  { id: 2, nome: 'Calçada danificada', descricao: 'Buracos, desníveis ou falta de calçada' },
  { id: 3, nome: 'Furto ou roubo', descricao: 'Ocorrência recente relatada por pedestres' },
  { id: 4, nome: 'Assédio', descricao: 'Abordagens ou intimidação no trajeto' },
  { id: 5, nome: 'Área deserta', descricao: 'Pouco movimento em certos horários' },
  { id: 6, nome: 'Obra ou bloqueio', descricao: 'Passagem obstruída ou desvio obrigatório' },
]
