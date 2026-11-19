const formatoData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatarDataHora(iso: string): string {
  const data = new Date(iso)
  return Number.isNaN(data.getTime()) ? iso : formatoData.format(data)
}

/** "há 3 h", "há 2 dias" — dá a noção de quão recente é o relato. */
export function tempoDecorrido(iso: string, agora: Date = new Date()): string {
  const minutos = Math.round((agora.getTime() - new Date(iso).getTime()) / 60000)
  if (Number.isNaN(minutos)) return ''
  if (minutos < 1) return 'agora'
  if (minutos < 60) return `há ${minutos} min`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return `há ${horas} h`
  const dias = Math.round(horas / 24)
  return dias === 1 ? 'há 1 dia' : `há ${dias} dias`
}

/** Grupos de recência usados na lista de relatos (uma sequência real de tempo). */
export const GRUPOS_TEMPO = ['Hoje', 'Ontem', 'Esta semana', 'Antes'] as const
export type GrupoTempo = (typeof GRUPOS_TEMPO)[number]

export function grupoDeTempo(iso: string, agora: Date = new Date()): GrupoTempo {
  const data = new Date(iso)
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime()
  const dia = 24 * 60 * 60 * 1000
  const t = data.getTime()
  if (t >= inicioHoje) return 'Hoje'
  if (t >= inicioHoje - dia) return 'Ontem'
  if (t >= inicioHoje - 6 * dia) return 'Esta semana'
  return 'Antes'
}
