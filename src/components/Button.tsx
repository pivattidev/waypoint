import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

/**
 * primario   = ação principal (teal)
 * secundario = contorno teal, ação de apoio ao lado da principal
 * neutro     = contorno discreto para o resto (tentar de novo, voltar...)
 * fantasma   = texto com cor de link
 * perigo     = ação destrutiva (rejeitar, excluir)
 */
export type VarianteBotao = 'primario' | 'secundario' | 'neutro' | 'fantasma' | 'perigo'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-ctl px-5 py-2.5 text-[15px] font-bold transition-[color,background-color,border-color,filter,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'

const variantes: Record<VarianteBotao, string> = {
  primario: 'bg-primary text-on-primary hover:brightness-110',
  secundario: 'border-2 border-primary text-link hover:bg-tealbg',
  neutro: 'border-2 border-line-strong text-ink hover:border-teal hover:bg-tealbg',
  fantasma: 'text-link underline-offset-4 hover:underline',
  perigo: 'bg-alert text-on-alert hover:brightness-110',
}

function classesBotao(variante: VarianteBotao = 'primario', extra = ''): string {
  return `${base} ${variantes[variante]} ${extra}`
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
  carregando?: boolean
}

export default function Button({ variante = 'primario', carregando = false, className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button className={classesBotao(variante, className)} disabled={disabled || carregando} {...props}>
      {carregando && <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />}
      {children}
    </button>
  )
}

interface LinkBotaoProps extends LinkProps {
  variante?: VarianteBotao
}

/** Link com cara de botão, para navegação. */
export function LinkBotao({ variante = 'primario', className = '', ...props }: LinkBotaoProps) {
  return <Link className={classesBotao(variante, className)} {...props} />
}
