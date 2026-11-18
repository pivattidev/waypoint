import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

interface RevelarProps {
  children: ReactNode
  /** Tag do elemento (section, li, div...). */
  como?: ElementType
  /** Posição dentro de um grupo: escalona a entrada (n * 70ms). */
  indice?: number
  className?: string
  id?: string
  'aria-labelledby'?: string
}

/**
 * Faz o bloco surgir (subindo um pouco) quando ele chega na tela durante a rolagem.
 * Usa IntersectionObserver: o navegador avisa quando o bloco aparece, sem cálculo a cada rolagem.
 * Depois de aparecer, para de observar (a animação roda uma vez só).
 */
export default function Revelar({ children, como: Tag = 'div', indice = 0, className = '', ...resto }: RevelarProps) {
  const ref = useRef<HTMLElement>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          observador.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' }, // começa um pouco antes de chegar ao fim da tela
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`revelar ${visivel ? 'visivel' : ''} ${className}`} style={{ '--i': indice } as CSSProperties} {...resto}>
      {children}
    </Tag>
  )
}
