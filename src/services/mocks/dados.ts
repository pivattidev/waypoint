// DADOS DE TESTE — no formato exato do contrato com a API Java.
// Servem para desenvolver as telas antes da API ficar pronta. Apagar os mocks quanddo integrar a API
import type { Categoria, Regiao } from '../../types/regiao'
import type { Relato } from '../../types/relato'

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

/** Data local "yyyy-MM-ddTHH:mm" de X minutos atrás: a demonstração sempre parece recente. */
function ha(minutos: number): string {
  const d = new Date(Date.now() - minutos * 60000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

const HORA = 60
const DIA = 24 * HORA

function relato(r: Omit<Relato, 'regiaoNome' | 'categoriaNome'>): Relato {
  return {
    ...r,
    regiaoNome: regioesMock.find((g) => g.id === r.regiaoId)?.nome ?? '',
    categoriaNome: categoriasMock.find((c) => c.id === r.categoriaId)?.nome ?? '',
  }
}

export const relatosMock: Relato[] = [
  relato({
    id: 1, regiaoId: 1, categoriaId: 1, status: 'APROVADO',
    titulo: 'Trecho escuro perto da escadaria',
    descricao: 'Três postes apagados no fim da rua. À noite fica difícil enxergar os degraus.',
    logradouro: 'R. Líbero Badaró, 300', latitude: -23.5478, longitude: -46.6358,
    dataOcorrencia: ha(52), dataEnvio: ha(40), motivoRejeicao: null,
    tags: ['noite', 'iluminação'],
  }),
  relato({
    id: 2, regiaoId: 1, categoriaId: 3, status: 'APROVADO',
    titulo: 'Furto de celular na saída do metrô',
    descricao: 'Pessoa de bicicleta puxou o celular de um pedestre perto da saída. Fique atento ao usar o telefone.',
    logradouro: 'Pça. da Sé', latitude: -23.5503, longitude: -46.6339,
    dataOcorrencia: ha(5 * HORA), dataEnvio: ha(4 * HORA + 30), motivoRejeicao: null,
    tags: ['metrô', 'celular'],
  }),
  relato({
    id: 3, regiaoId: 2, categoriaId: 2, status: 'APROVADO',
    titulo: 'Calçada quebrada em frente à obra',
    descricao: 'Placas soltas e desnível grande. Cadeirantes precisam descer para a rua.',
    logradouro: 'Al. Santos, 1200', latitude: -23.5652, longitude: -46.6538,
    dataOcorrencia: ha(DIA + 3 * HORA), dataEnvio: ha(DIA + 2 * HORA), motivoRejeicao: null,
    tags: ['acessibilidade'],
  }),
  relato({
    id: 4, regiaoId: 3, categoriaId: 5, status: 'APROVADO',
    titulo: 'Rua sem movimento depois das 22h',
    descricao: 'O comércio fecha cedo e a rua fica vazia. Prefira a avenida paralela.',
    logradouro: 'R. dos Pinheiros, 900', latitude: -23.5662, longitude: -46.6865,
    dataOcorrencia: ha(3 * DIA), dataEnvio: ha(3 * DIA - HORA), motivoRejeicao: null,
    tags: ['noite'],
  }),
  relato({
    id: 5, regiaoId: 4, categoriaId: 6, status: 'APROVADO',
    titulo: 'Bloqueio na calçada por obra da Sabesp',
    descricao: 'Desvio pela rua sem sinalização para pedestres.',
    logradouro: 'R. Domingos de Morais, 2000', latitude: -23.5915, longitude: -46.6349,
    dataOcorrencia: ha(DIA + 8 * HORA), dataEnvio: ha(DIA + 7 * HORA), motivoRejeicao: null,
    tags: ['obra'],
  }),
  relato({
    id: 9, regiaoId: 1, categoriaId: 2, status: 'APROVADO',
    titulo: 'Bueiro sem tampa na faixa de pedestres',
    descricao: 'Buraco aberto bem no meio da faixa. À noite quase não se vê.',
    logradouro: 'R. Direita, 150', latitude: -23.5486, longitude: -46.6352,
    dataOcorrencia: ha(2 * HORA), dataEnvio: ha(HORA + 30), motivoRejeicao: null,
    tags: ['calçada'],
  }),
  relato({
    id: 10, regiaoId: 2, categoriaId: 1, status: 'APROVADO',
    titulo: 'Três postes apagados na Rua Augusta',
    descricao: 'Trecho escuro entre a Paulista e a Luís Coelho.',
    logradouro: 'R. Augusta, 1400', latitude: -23.5577, longitude: -46.6607,
    dataOcorrencia: ha(20), dataEnvio: ha(12), motivoRejeicao: null,
    tags: ['noite', 'iluminação'],
  }),
  relato({
    id: 11, regiaoId: 5, categoriaId: 5, status: 'APROVADO',
    titulo: 'Viaduto sem movimento à noite',
    descricao: 'Passagem longa e vazia depois das 21h. Há outra travessia duas quadras abaixo.',
    logradouro: 'Viaduto Bresser', latitude: -23.5452, longitude: -46.6072,
    dataOcorrencia: ha(6 * DIA), dataEnvio: ha(6 * DIA - 2 * HORA), motivoRejeicao: null,
    tags: ['noite'],
  }),
  relato({
    id: 6, regiaoId: 5, categoriaId: 4, status: 'PENDENTE',
    titulo: 'Abordagem insistente no ponto de ônibus',
    descricao: 'Um homem seguiu duas pessoas por um quarteirão depois do ponto.',
    logradouro: 'R. da Mooca, 1500', latitude: -23.5588, longitude: -46.6012,
    dataOcorrencia: ha(3 * HORA), dataEnvio: ha(2 * HORA), motivoRejeicao: null,
    tags: ['ônibus', 'noite'],
  }),
  relato({
    id: 7, regiaoId: 2, categoriaId: 1, status: 'PENDENTE',
    titulo: 'Passagem subterrânea com luz falhando',
    descricao: 'A iluminação pisca e metade das lâmpadas está apagada.',
    logradouro: 'Av. Paulista x R. da Consolação', latitude: -23.5568, longitude: -46.6622,
    dataOcorrencia: ha(6 * HORA), dataEnvio: ha(5 * HORA), motivoRejeicao: null,
    tags: ['iluminação'],
  }),
  relato({
    id: 12, regiaoId: 1, categoriaId: 6, status: 'PENDENTE',
    titulo: 'Tapume fechando a calçada inteira',
    descricao: 'Obra de prédio ocupa toda a calçada. É preciso andar pela rua.',
    logradouro: 'R. São Bento, 400', latitude: -23.5459, longitude: -46.6343,
    dataOcorrencia: ha(DIA), dataEnvio: ha(DIA - HORA), motivoRejeicao: null,
    tags: ['obra'],
  }),
  relato({
    id: 8, regiaoId: 3, categoriaId: 3, status: 'REJEITADO',
    titulo: 'Assalto',
    descricao: 'Teve assalto aqui.',
    logradouro: 'Largo da Batata', latitude: -23.5672, longitude: -46.6932,
    dataOcorrencia: ha(8 * DIA), dataEnvio: ha(8 * DIA),
    motivoRejeicao: 'Relato sem detalhes suficientes para orientar outros pedestres.',
    tags: [],
  }),
]
