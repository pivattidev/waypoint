import type { Relato } from '../types/relato'
import MapaBase from './MapaBase'
import Pin from './Pin'

interface MapaPreviaProps {
  relatos: Relato[]
  selecionadoId: number | null
  className?: string
}

/** Selo de honestidade: o fundo é desenhado, não é um mapa real. */
function SeloIlustrativo() {
  return (
    <p className="absolute right-3 top-3 rounded-full bg-panel/95 px-3 py-1.5 text-[13px] font-bold text-muted shadow-sm">
      Mapa ilustrativo, posições aproximadas
    </p>
  )
}

/**
 * Posiciona os relatos pela latitude/longitude sobre o fundo ilustrado (MapaBase).
 * Quando o Leaflet for liberado, este componente é o único a trocar: as props continuam as mesmas.
 */
export default function MapaPrevia({ relatos, selecionadoId, className = '' }: MapaPreviaProps) {
  const lats = relatos.map((r) => r.latitude)
  const lngs = relatos.map((r) => r.longitude)
  const margem = 0.004
  const minLat = Math.min(...lats) - margem
  const maxLat = Math.max(...lats) + margem
  const minLng = Math.min(...lngs) - margem
  const maxLng = Math.max(...lngs) + margem

  // 10%–90% para os pins não encostarem na borda
  const x = (r: Relato) => 10 + ((r.longitude - minLng) / (maxLng - minLng || 1)) * 80
  const y = (r: Relato) => 18 + ((maxLat - r.latitude) / (maxLat - minLat || 1)) * 66

  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-mapa border border-line ${className}`}>
      <MapaBase />
      {relatos.map((r, i) => {
        const ativo = selecionadoId === r.id
        // Os pins "pousam" um a um quando o mapa aparece (entrada em sequência)
        return (
          <span key={r.id} style={{ left: `${x(r)}%`, top: `${y(r)}%` }} className="absolute grid -translate-x-1/2 -translate-y-[85%] place-items-end justify-center">
            <span className="pousar grid" style={{ animationDelay: `${150 + i * 70}ms` }}>
              <Pin className={ativo ? 'size-12' : 'size-8'} ativo={ativo} />
            </span>
          </span>
        )
      })}

      <SeloIlustrativo />
    </div>
  )
}
