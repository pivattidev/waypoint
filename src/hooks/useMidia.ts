import { useEffect, useState } from 'react'

/** true enquanto a media query casar (ex.: '(min-width: 1024px)'). Usado para trocar layout sem duplicar componentes. */
export function useMidia(consulta: string): boolean {
  const [casa, setCasa] = useState(() => window.matchMedia(consulta).matches)

  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const aoMudar = () => setCasa(mq.matches)
    aoMudar()
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [consulta])

  return casa
}
