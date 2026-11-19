import type { ReactNode } from 'react'

/** relato = vermelho (categoria de relato, alerta) · neutro = teal (ok, informação) · apagado = linha */
export type TomSelo = 'relato' | 'neutro' | 'apagado'

const tons: Record<TomSelo, string> = {
  relato: 'bg-alert-bg text-alert-text',
  neutro: 'bg-tealbg text-link',
  apagado: 'border border-line text-muted',
}

export default function Selo({ tom = 'neutro', children, className = '' }: { tom?: TomSelo; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold leading-none ${tons[tom]} ${className}`}>
      {children}
    </span>
  )
}
