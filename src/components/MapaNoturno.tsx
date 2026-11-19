import { DESTINO, ORIGEM, PONTOS_RELATO, POSTES, ROTAS, type IdRota, type Ponto } from '../utils/rotasExemplo'

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

/** Transforma a lista de pontos no atributo "d" do <path>: M = começa aqui, L = linha até aqui. */
const d = (pontos: Ponto[]) => pontos.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')

const GIRO = -9

interface MapaNoturnoProps {
  rotaSelecionada: IdRota
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

/**
 * Mapa noturno ILUSTRADO do hero. Segurança = luz: a rota sem relatos é acesa por postes;
 * no trecho com relatos os postes estão apagados.
 */
export default function MapaNoturno({ rotaSelecionada, className = '', recorte = '0 0 1600 900', encaixe = 'slice' }: MapaNoturnoProps) {
  // A rota escolhida é desenhada por último, para ficar por cima da outra
  const ordem: IdRota[] = rotaSelecionada === 'direta' ? ['iluminada', 'direta'] : ['direta', 'iluminada']

  return (
    <svg
      viewBox={recorte}
      preserveAspectRatio={encaixe === 'meet' ? 'xMidYMid meet' : 'xMidYMid slice'}
      className={`size-full ${encaixe === 'meet' ? 'overflow-visible' : ''} ${className}`}
      aria-hidden
    >
      <defs>
        {/* Halo amarelo em volta de cada poste aceso */}
        <radialGradient id="halo-poste">
          <stop offset="0%" stopColor="var(--lamp)" stopOpacity="0.5" />
          <stop offset="45%" stopColor="var(--lamp)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--lamp)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={`translate(-10 -45) rotate(${GIRO} 800 450)`}>
        <BaseMapa />

        {/* Postes: halo só na rota escolhida; contorno apagado onde há relato */}
        {(['direta', 'iluminada'] as IdRota[]).map((id) =>
          POSTES[id].map((p, i) =>
            p.aceso ? (
              <g key={`${id}${i}`} className="poste-aceso" style={{ animationDelay: `${0.25 + p.t * 1.5}s` }}>
                {id === rotaSelecionada && <circle cx={p.x} cy={p.y} r="48" fill="url(#halo-poste)" />}
                <circle cx={p.x} cy={p.y} r="3.5" fill="var(--lamp-glow)" opacity={id === rotaSelecionada ? 1 : 0.45} />
              </g>
            ) : (
              <circle key={`${id}${i}`} cx={p.x} cy={p.y} r="3.5" fill="none" stroke="var(--nite-label)" strokeWidth="1.5" />
            ),
          ),
        )}

        {/* Rotas: a selecionada por cima */}
        {ordem.map((id) => {
          const ativa = id === rotaSelecionada
          return (
            <g key={id} opacity={ativa ? 1 : 0.5}>
              <path d={d(ROTAS[id])} fill="none" stroke="var(--nite-bg)" strokeWidth={ativa ? 20 : 14} strokeLinecap="round" strokeLinejoin="round" />
              <path
                // key muda com a rota: a animação de traçar roda de novo ao escolher outra rota
                key={ativa ? `ativa-${id}` : id}
                d={d(ROTAS[id])}
                pathLength={1}
                className={ativa ? 'rota-tracada' : undefined}
                fill="none"
                stroke={ativa ? 'var(--nite-teal)' : 'var(--nite-route-alt)'}
                strokeWidth={ativa ? 9 : 6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={ativa ? undefined : '0.004 0.012'}
              />
            </g>
          )
        })}

        {/* Origem */}
        <g transform={`translate(${ORIGEM[0]} ${ORIGEM[1]})`}>
          <circle r="16" fill="var(--nite-bg)" stroke="var(--nite-ink)" strokeWidth="5" />
          <circle r="6" fill="var(--nite-ink)" />
        </g>
        {/* Nomes da origem e do destino, em etiqueta */}
        {(
          [
            [ORIGEM, 'Estação Sé', 30, 10],
            [DESTINO, 'Av. Paulista, 1000', -34, -34],
          ] as [Ponto, string, number, number][]
        ).map(([[x, y], nome, dx, dy]) => (
          <g key={nome} transform={`translate(${x} ${y}) rotate(${-GIRO}) translate(${dx} ${dy})`}>
            <rect x={dx < 0 ? -nome.length * 9.4 - 20 : 0} y="-17" width={nome.length * 9.4 + 20} height="34" rx="8" fill="var(--nite-ink)" />
            <text x={dx < 0 ? -10 : 10} y="6" textAnchor={dx < 0 ? 'end' : 'start'} fontFamily="var(--font-display)" fontSize="18" fontWeight="800" fill="var(--nite-bg)">
              {nome}
            </text>
          </g>
        ))}
        {/* Destino */}
        <g transform={`translate(${DESTINO[0]} ${DESTINO[1]})`}>
          <circle r="20" fill="var(--nite-ink)" />
          <circle r="11" fill="var(--nite-bg)" />
          <circle r="5" fill="var(--nite-ink)" />
        </g>

        {/* Relatos aprovados (no trecho escuro da rota direta) */}
        {PONTOS_RELATO.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${-GIRO})`} opacity={rotaSelecionada === 'direta' ? 1 : 0.6}>
            {/* Pin desenhado em 24x24 e aumentado 1,85x: a ponta (12,22) fica em cima do ponto */}
            <g transform="translate(-22.2 -40.7) scale(1.85)">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z" fill="var(--nite-alert)" stroke="var(--nite-bg)" strokeWidth="1.4" />
              <circle cx="12" cy="9" r="2.6" fill="var(--nite-bg)" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  )
}
