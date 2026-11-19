/**
 * Mapa noturno ILUSTRADO do hero (o cálculo real de rota é da fase 2, via API).
 * Conceito: segurança = luz. A rota segura é acesa por postes; no trecho com relatos os postes estão apagados.
 *
 * Desenho em um sistema de 1600x900 com preserveAspectRatio: o mapa preenche qualquer contêiner
 * sem distorcer. Ruas, rotas e pins ficam num grupo girado para o traçado não parecer uma planilha.
 */

const RUAS_X = [-360, -200, -40, 120, 280, 440, 600, 760, 920, 1080, 1240, 1400, 1560, 1720, 1880, 2040]
const RUAS_Y = [-220, -80, 80, 220, 360, 500, 640, 780, 920, 1060, 1200]
const AVENIDAS_X = [920, 1400]
const AVENIDAS_Y = [500, 220]

const GIRO = -9

interface MapaNoturnoProps {
  className?: string
  /** Recorte do desenho (viewBox). */
  recorte?: string
  /**
   * slice = preenche o contêiner cortando as sobras (celular)
   * meet  = mostra o recorte inteiro e deixa as ruas continuarem em volta (desktop): as rotas nunca são cortadas
   */
  encaixe?: 'slice' | 'meet'
}

/** Base do mapa (rio, praças, ruas, nomes): não depende da rota escolhida. */
function BaseMapa() {
  return (
    <>
      {/* Rio */}
      <path
        d="M-400 1010 C 0 930, 300 1100, 700 1030 S 1300 940, 1700 1060 S 2100 1000, 2300 1040"
        fill="none"
        stroke="var(--nite-water)"
        strokeWidth="90"
        strokeLinecap="round"
      />
      {/* Praças */}
      <rect x="452" y="232" width="136" height="116" rx="10" fill="var(--nite-park)" />
      <rect x="1572" y="512" width="136" height="116" rx="10" fill="var(--nite-park)" />

      {/* Ruas: as avenidas são mais largas e mais claras */}
      {RUAS_X.map((x) => (
        <line key={`x${x}`} x1={x} y1={-400} x2={x} y2={1300} stroke={AVENIDAS_X.includes(x) ? 'var(--nite-avenue)' : 'var(--nite-street)'} strokeWidth={AVENIDAS_X.includes(x) ? 22 : 12} />
      ))}
      {RUAS_Y.map((y) => (
        <line key={`y${y}`} x1={-500} y1={y} x2={2200} y2={y} stroke={AVENIDAS_Y.includes(y) ? 'var(--nite-avenue)' : 'var(--nite-street)'} strokeWidth={AVENIDAS_Y.includes(y) ? 22 : 12} />
      ))}
      {/* Avenida diagonal */}
      <path id="avenida-diagonal" d="M-300 1180 L 2100 -260" stroke="var(--nite-avenue)" strokeWidth="26" />

      {/* Nomes de rua (caixa alta só aqui: é a convenção das cartas de rua) */}
      <g fill="var(--nite-label)" fontFamily="var(--font-display)" fontSize="15" fontWeight="600" letterSpacing="1.5">
        <text x={1520} y={492}>
          AV. DA CONSOLAÇÃO
        </text>
        <text x={150} y={212}>
          R. AUGUSTA
        </text>
        <text dy={-20}>
          <textPath href="#avenida-diagonal" startOffset="62%">
            AV. PAULISTA
          </textPath>
        </text>
      </g>
    </>
  )
}

/** Mapa noturno ILUSTRADO do hero. */
export default function MapaNoturno({ className = '', recorte = '0 0 1600 900', encaixe = 'slice' }: MapaNoturnoProps) {
  return (
    <svg
      viewBox={recorte}
      preserveAspectRatio={encaixe === 'meet' ? 'xMidYMid meet' : 'xMidYMid slice'}
      className={`size-full ${encaixe === 'meet' ? 'overflow-visible' : ''} ${className}`}
      aria-hidden
    >
      <g transform={`translate(-10 -45) rotate(${GIRO} 800 450)`}>
        <BaseMapa />
      </g>
    </svg>
  )
}
