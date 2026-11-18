import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const classesEntrada =
  'w-full min-h-12 rounded-ctl border border-line-strong bg-panel px-4 py-3 text-[17px] text-ink placeholder:text-muted transition-colors duration-150 hover:border-ink-2 focus:border-teal aria-invalid:border-alert aria-invalid:bg-alert-bg'

interface CampoProps {
  id: string
  rotulo: string
  erro?: string
  dica?: string
  children: ReactNode
}

/** Rótulo + controle + dica/erro. O controle aponta para a mensagem via aria-describedby. */
export default function Campo({ id, rotulo, erro, dica, children }: CampoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-bold text-ink">
        {rotulo}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-msg`} className="flex items-start gap-1.5 text-sm font-bold text-alert-text">
          <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0" aria-hidden>
            <circle cx="8" cy="8" r="7" fill="currentColor" />
            <path d="M8 4.5v4M8 10.8v.2" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {erro}
        </p>
      ) : (
        dica && (
          <p id={`${id}-msg`} className="text-sm text-muted">
            {dica}
          </p>
        )
      )}
    </div>
  )
}

type ComErro = { erro?: boolean }

export function Entrada({ erro, id, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & ComErro) {
  return <input id={id} aria-invalid={erro || undefined} aria-describedby={`${id}-msg`} className={`${classesEntrada} ${className}`} {...props} />
}

export function AreaTexto({ erro, id, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & ComErro) {
  return <textarea id={id} aria-invalid={erro || undefined} aria-describedby={`${id}-msg`} className={`${classesEntrada} min-h-32`} {...props} />
}

export function Selecao({ erro, id, ...props }: SelectHTMLAttributes<HTMLSelectElement> & ComErro) {
  return <select id={id} aria-invalid={erro || undefined} aria-describedby={`${id}-msg`} className={classesEntrada} {...props} />
}
