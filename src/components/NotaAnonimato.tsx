interface NotaAnonimatoProps {
  /** Mostra o título "Seu relato é anônimo" (o formulário usa; a Home tem o próprio título). */
  comTitulo?: boolean
  className?: string
}

const guarda = ['O que aconteceu', 'Onde e quando', 'O tipo de relato']
const nunca = ['Seu nome', 'Seu e-mail', 'Seu IP ou aparelho']

/**
 * O que o relato guarda e o que nunca guarda: espelha o modelo de dados (tb_relato não tem coluna de autor).
 * Versão leve, sem caixa: usada no Enviar relato e na Home.
 */
export default function NotaAnonimato({ comTitulo = true, className = '' }: NotaAnonimatoProps) {
  return (
    <div className={`max-w-sm ${className}`}>
      {comTitulo && (
        <>
          <h2 className="text-xl">Seu relato é anônimo</h2>
          <p className="mt-2 text-[15px] text-muted">A moderação lê o relato antes de publicar, sem saber quem enviou.</p>
        </>
      )}
      <ul className={`space-y-2.5 text-[15px] ${comTitulo ? 'mt-6' : ''}`}>
        {guarda.map((g) => (
          <li key={g} className="flex items-center gap-3 text-ink-2">
            <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-link" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 8.5l3 3 7-7" />
            </svg>
            {g}
          </li>
        ))}
        {nunca.map((n) => (
          <li key={n} className="flex items-center gap-3 text-muted">
            <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-alert-text" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
            <span>
              <span className="sr-only">Não guardamos: </span>
              {n}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-8 flex items-center gap-2.5 text-[15px] font-bold">
        <span className="size-2 shrink-0 rounded-full bg-alert" aria-hidden />
        Em emergência, ligue 190.
      </p>
    </div>
  )
}
