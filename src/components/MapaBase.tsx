import type { ReactNode } from 'react'

/**
 * Fundo de mapa ILUSTRADO (quarteirões em SVG), enquanto o Leaflet não é liberado pelo professor.
 * Sempre exibido com o selo "Mapa ilustrativo": as posições são aproximadas.
 * Coordenadas em 0–100 nos dois eixos: o SVG estica para o contêiner (preserveAspectRatio="none")
 * e os traços mantêm a espessura em pixels (vector-effect), então left/top em % batem com o desenho.
 */

/** Ruas verticais e horizontais (centro de cada rua, em %). */
const RUAS_X = [8, 22, 38, 53, 67, 80, 94]
const RUAS_Y = [10, 24, 38, 52, 65, 78, 92]

const MEIA_RUA = 1.1
const PARQUE = { x: 2, y: 3 } // índice do quarteirão que vira praça

function quarteiroes() {
  const xs = [-5, ...RUAS_X, 105]
  const ys = [-5, ...RUAS_Y, 105]
  const blocos: { x: number; y: number; w: number; h: number; parque: boolean }[] = []
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      blocos.push({
        x: xs[i] + MEIA_RUA,
        y: ys[j] + MEIA_RUA,
        w: xs[i + 1] - xs[i] - MEIA_RUA * 2,
        h: ys[j + 1] - ys[j] - MEIA_RUA * 2,
        parque: i === PARQUE.x && j === PARQUE.y,
      })
    }
  }
  return blocos
}

const BLOCOS = quarteiroes()

interface MapaBaseProps {
  children?: ReactNode // traços extras (rotas) dentro do SVG
  className?: string
}

export default function MapaBase({ children, className = '' }: MapaBaseProps) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`absolute inset-0 size-full bg-map ${className}`} aria-hidden>
      {BLOCOS.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="0.6" fill={b.parque ? 'var(--map-park)' : 'var(--map-block)'} />
      ))}
      {/* Rio e avenida diagonal: quebram a grade para parecer cidade, não planilha */}
      <path d="M-5 84 C 20 78, 35 92, 55 87 S 85 80, 105 88" fill="none" stroke="var(--map-water)" strokeWidth="22" vectorEffect="non-scaling-stroke" />
      <path d="M-5 70 L 105 8" fill="none" stroke="var(--map)" strokeWidth="9" vectorEffect="non-scaling-stroke" />
      {children}
    </svg>
  )
}
