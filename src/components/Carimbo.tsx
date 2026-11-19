interface CarimboProps {
  className?: string
}

/**
 * Carimbo "Verificado pela moderação".
 * Forma própria (escudo + check + texto) para não depender só da cor.
 */
export default function Carimbo({ className = '' }: CarimboProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-tealbg px-3 py-1 text-[13px] font-bold leading-none text-link ${className}`}>
      <Escudo className="size-3.5" />
      Verificado pela moderação
    </span>
  )
}

function Escudo({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2.5l8 3.2v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6l8-3.2Z" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </svg>
  )
}
