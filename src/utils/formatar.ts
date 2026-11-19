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
