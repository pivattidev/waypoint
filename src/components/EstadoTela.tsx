import { useEffect, useState, type ReactNode } from 'react'
import Button from './Button'

type FormatoSkeleton = 'linhas' | 'bloco'

/** Rota que "anda" enquanto o servidor do Render acorda (só aparece numa espera longa). */
function RotaAndando() {
  return (
    <svg viewBox="0 0 120 24" className="h-6 w-28 shrink-0" aria-hidden>
      <circle cx="8" cy="12" r="5" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path d="M16 12 H100" fill="none" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" className="rota-andando" />
      <path d="M112 3a6 6 0 0 0-6 6c0 4.5 6 11 6 11s6-6.5 6-11a6 6 0 0 0-6-6Z" fill="var(--alert)" />
    </svg>
  )
}

/**
 * Carregando em skeleton com o MESMO formato do conteúdo final (linhas da lista ou bloco).
 * Depois de 4 s avisa que o servidor pode estar acordando (o Render gratuito hiberna).
 */
export function Carregando({ texto = 'Carregando', formato = 'linhas' }: { texto?: string; formato?: FormatoSkeleton }) {
  const [demorando, setDemorando] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDemorando(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{texto}…</span>
      {formato === 'linhas' ? (
        <div className="flex flex-col border-b border-line" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-t border-line py-5 sm:grid-cols-[7rem_auto_minmax(0,1fr)] sm:gap-5">
              <div className="hidden h-4 w-16 animate-pulse rounded-md bg-skeleton sm:block" />
              <div className="size-10 animate-pulse rounded-full bg-skeleton" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-28 animate-pulse rounded-md bg-skeleton opacity-70" />
                <div className="h-6 w-3/4 animate-pulse rounded-md bg-skeleton" />
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-skeleton opacity-70" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3" aria-hidden>
          <div className="h-8 w-2/3 animate-pulse rounded-md bg-skeleton" />
          <div className="h-4 w-full animate-pulse rounded-md bg-skeleton opacity-70" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-skeleton opacity-70" />
          <div className="mt-4 h-40 w-full animate-pulse rounded-painel bg-skeleton opacity-60" />
        </div>
      )}
      {demorando && (
        <p className="mt-5 flex items-center gap-3 text-[15px] text-muted">
          <RotaAndando />
          O servidor está acordando. Isso leva até um minuto.
        </p>
      )}
    </div>
  )
}

interface MensagemErroProps {
  /** O que não carregou, específico: "Não foi possível carregar os relatos". */
  titulo?: string
  mensagem: string
  onTentarNovamente?: () => void
}

export function MensagemErro({ titulo = 'Não foi possível carregar', mensagem, onTentarNovamente }: MensagemErroProps) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 rounded-painel bg-alert-bg p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <svg viewBox="0 0 24 24" className="mt-0.5 size-6 shrink-0 text-alert-text" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M12 7v6M12 16.5v.5" stroke="var(--alert-bg)" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <div>
          <p className="font-display text-lg font-bold text-alert-text">{titulo}</p>
          <p className="mt-1 text-[15px] text-ink">{mensagem}</p>
        </div>
      </div>
      {onTentarNovamente && (
        <Button variante="neutro" onClick={onTentarNovamente} className="shrink-0 bg-panel">
          Tentar de novo
        </Button>
      )}
    </div>
  )
}

/** Vazio é um convite para agir: título claro e, se fizer sentido, uma ação. */
export function ListaVazia({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-painel border-2 border-dashed border-line px-6 py-12 text-center">
      <svg viewBox="0 0 48 24" className="mb-2 h-6 w-12 text-muted" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
        <circle cx="6" cy="12" r="4" />
        <path d="M14 12h22" strokeDasharray="1 5" />
        <circle cx="42" cy="12" r="4" />
      </svg>
      <p className="font-display text-lg font-bold">{titulo}</p>
      {children && <div className="text-[15px] text-muted">{children}</div>}
    </div>
  )
}
