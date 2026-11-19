import type { ReactNode } from 'react'

/**
 * Símbolos de legenda para cada tipo de relato, como num mapa impresso.
 * Casamento pelo nome (a API pode numerar as categorias de outro jeito).
 */

type Simbolo = 'luz' | 'calcada' | 'furto' | 'assedio' | 'deserta' | 'obra' | 'outro'

function simboloDe(nome: string): Simbolo {
  const n = nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
  if (n.includes('ilumina')) return 'luz'
  if (n.includes('calcada') || n.includes('esburac') || n.includes('rampa')) return 'calcada'
  if (n.includes('furto') || n.includes('roubo') || n.includes('assalto')) return 'furto'
  if (n.includes('assedio')) return 'assedio'
  if (n.includes('desert')) return 'deserta'
  if (n.includes('obra') || n.includes('bloqueio')) return 'obra'
  return 'outro'
}

const desenhos: Record<Simbolo, ReactNode> = {
  // Poste apagado
  luz: (
    <>
      <path d="M9 21h6M12 21V9" />
      <path d="M7 9h10l-1.5-4h-7L7 9Z" />
      <path d="M4 15l3-2M20 15l-3-2" strokeDasharray="1 2.4" />
    </>
  ),
  // Placas de calçada desalinhadas
  calcada: (
    <>
      <path d="M3 17h7l1 -2h10" />
      <path d="M3 21h18" />
      <path d="M8 17v4M15 15v6" />
      <path d="M11 4l1.5 3-2 2 1.5 3" />
    </>
  ),
  // Celular sendo puxado
  furto: (
    <>
      <rect x="9" y="3" width="8" height="13" rx="1.6" />
      <path d="M3 13c2-1 4-1 6 0M3 17c3 0 5-1 6-2" />
      <path d="M12 13h2" />
    </>
  ),
  // Pessoa com sinal de alerta
  assedio: (
    <>
      <circle cx="9" cy="6" r="2.5" />
      <path d="M4.5 20v-4a4.5 4.5 0 0 1 9 0v4" />
      <path d="M19 5v7M19 15.5v.5" />
    </>
  ),
  // Rua vazia com lua
  deserta: (
    <>
      <path d="M15.5 3.5a4 4 0 1 0 5 5 3.5 3.5 0 0 1-5-5Z" />
      <path d="M6 21l3-11M18 21l-3-7" />
      <path d="M12 21v-2M12 16v-1.5" />
    </>
  ),
  // Cone de obra
  obra: (
    <>
      <path d="M10 4h4l4.5 15h-13L10 4Z" />
      <path d="M8.3 10h7.4M6.8 15h10.4" />
      <path d="M3 20h18" />
    </>
  ),
  outro: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5M12 16v.5" />
    </>
  ),
}

export default function CategoriaIcone({ nome, className = 'size-5' }: { nome: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {desenhos[simboloDe(nome)]}
    </svg>
  )
}
