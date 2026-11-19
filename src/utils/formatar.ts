const formatoData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const formatoDia = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** A API Java guarda só a data ("2026-11-18"), sem hora. */
const soData = (iso: string) => /^\d{4}-\d{2}-\d{2}$/.test(iso)

/** Lê a data no fuso do computador (new Date("2026-11-18") leria em UTC e voltaria um dia no Brasil). */
function lerData(iso: string): Date {
  if (!soData(iso)) return new Date(iso)
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(ano, mes - 1, dia)
}

const DIA_MS = 24 * 60 * 60 * 1000

export function formatarDataHora(iso: string): string {
  const data = lerData(iso)
  if (Number.isNaN(data.getTime())) return iso
  return soData(iso) ? formatoDia.format(data) : formatoData.format(data)
}

/** "há 3 h", "há 2 dias" — dá a noção de quão recente é o relato. */
export function tempoDecorrido(iso: string, agora: Date = new Date()): string {
  if (soData(iso)) {
    // Sem hora: conta em dias
    const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime()
    const dias = Math.round((inicioHoje - lerData(iso).getTime()) / DIA_MS)
    if (Number.isNaN(dias)) return ''
    if (dias <= 0) return 'hoje'
    return dias === 1 ? 'ontem' : `há ${dias} dias`
  }
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
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime()
  const t = lerData(iso).getTime()
  if (t >= inicioHoje) return 'Hoje'
  if (t >= inicioHoje - DIA_MS) return 'Ontem'
  if (t >= inicioHoje - 6 * DIA_MS) return 'Esta semana'
  return 'Antes'
}
