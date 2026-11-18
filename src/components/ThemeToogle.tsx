import { useTema } from '../contexts/ThemeContext'

/**
 * Troca de tema como "dia e noite na rua":
 * no tema noite o botão mostra o SOL (ir para o dia); no claro mostra o POSTE (acender a noite).
 */
export default function ThemeToggle() {
  const { tema, alternarTema } = useTema()
  const noite = tema === 'noite'
  const acao = noite ? 'Usar tema claro' : 'Usar tema noite'

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={acao}
      title={acao}
      className="grid size-11 place-items-center rounded-ctl text-ink transition-colors hover:bg-tealbg"
    >
      {noite ? (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // Poste de luz: haste, braço e luminária
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7 22V6a3 3 0 0 1 3-3h4" />
          <path d="M12 3h6l1.5 3h-9L12 3Z" />
          <path d="M15 9v1.5M5 22h4" />
        </svg>
      )}
    </button>
  )
}
