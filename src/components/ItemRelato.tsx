import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Relato } from '../types/relato'
import { tempoDecorrido } from '../utils/formatar'
import CategoriaIcone from './CategoriaIcone'

interface ItemRelatoProps {
  relato: Relato
  /** Posição na lista: escalona a animação de entrada. */
  indice?: number
}

/**
 * Linha de relato, versão enxuta: símbolo da categoria, título, onde, e há quanto tempo.
 * Sem caixas nem bordas grossas: só a linha fina entre os itens (como o meio-fio).
 */
export default function ItemRelato({ relato, indice = 0 }: ItemRelatoProps) {
  return (
    <Link
      to={`/relatos/${relato.id}`}
      className="entrar group grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-4 gap-y-1 border-b border-line py-5 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:gap-x-6"
      style={{ '--i': Math.min(indice, 10) } as CSSProperties}
    >
      {/* Símbolo da categoria, como na legenda de um mapa */}
      <span className="mt-0.5 grid size-8 place-items-center rounded-full bg-alert-bg text-alert-text">
        <CategoriaIcone nome={relato.categoriaNome} className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[1.2rem] font-bold leading-snug tracking-[-0.01em] text-ink decoration-2 underline-offset-4 transition-colors group-hover:text-link group-hover:underline">
          {relato.titulo}
        </span>
        <span className="mt-1 block text-[15px] text-muted">
          {relato.categoriaNome}, {relato.logradouro}, {relato.regiaoNome}
        </span>
      </span>
      <time dateTime={relato.dataOcorrencia} className="tabular col-start-2 text-sm font-bold text-muted sm:col-start-auto sm:pt-1.5">
        {tempoDecorrido(relato.dataOcorrencia)}
      </time>
    </Link>
  )
}
