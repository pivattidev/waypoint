export type TipoPin = 'relato' | 'origem' | 'destino'

interface PinProps {
  tipo?: TipoPin
  className?: string
  ativo?: boolean
}

/**
 * Marcadores do mapa.
 * relato  = gota vermelha (vermelho só onde há relato)
 * origem  = ponto na cor do texto
 * destino = alvo na cor do texto (vermelho fica só para relato)
 */
export default function Pin({ tipo = 'relato', className = 'size-7', ativo = false }: PinProps) {
  if (tipo === 'origem') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle cx="12" cy="12" r="9" fill="var(--bg)" stroke="var(--ink)" strokeWidth="3" />
        <circle cx="12" cy="12" r="4" fill="var(--ink)" />
      </svg>
    )
  }

  if (tipo === 'destino') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle cx="12" cy="12" r="10" fill="var(--ink)" />
        <circle cx="12" cy="12" r="5.5" fill="var(--bg)" />
        <circle cx="12" cy="12" r="2.5" fill="var(--ink)" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={`${className} drop-shadow-[0_2px_3px_rgb(0_0_0/0.25)]`} aria-hidden>
      <path
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
        fill="var(--alert)"
        stroke={ativo ? 'var(--ink)' : 'var(--bg)'}
        strokeWidth={ativo ? 2 : 1.5}
      />
      <circle cx="12" cy="9" r="2.6" fill="var(--bg)" />
    </svg>
  )
}
