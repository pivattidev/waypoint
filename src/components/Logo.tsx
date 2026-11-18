import { Link } from 'react-router-dom'

/**
 * Logotipo: ponto de partida, caminho pontilhado e o pin de chegada.
 * Logo SVG temporária
 */
export function MarcaWaypoint({ className = 'h-7 w-auto', corPin = 'var(--alert)', corFundo = 'var(--bg)' }: { className?: string; corPin?: string; corFundo?: string }) {
  return (
    <svg viewBox="0 0 34 28" className={className} aria-hidden>
      <circle cx="5" cy="22" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M9 21c5-1 6-6 11-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="0.1 4.2" />
      <path d="M26 1.5a6.5 6.5 0 0 0-6.5 6.5c0 4.9 6.5 12 6.5 12s6.5-7.1 6.5-12A6.5 6.5 0 0 0 26 1.5Z" fill={corPin} />
      <circle cx="26" cy="8" r="2.4" fill={corFundo} />
    </svg>
  )
}

export default function Logo({ comoLink = true, className = '' }: { comoLink?: boolean; className?: string }) {
  const conteudo = (
    <>
      <MarcaWaypoint />
      <span className="font-display text-[22px] font-black tracking-[-0.04em]">WayPoint</span>
    </>
  )

  const classes = `inline-flex items-center gap-2 text-ink ${className}`
  return comoLink ? (
    <Link to="/" className={classes} aria-label="WayPoint, início">
      {conteudo}
    </Link>
  ) : (
    <span className={classes}>{conteudo}</span>
  )
}
