import { Link } from 'react-router-dom'
import type { Relato } from '../types/relato'
import { tempoDecorrido } from '../utils/formatar'
import Carimbo from './Carimbo'
import CategoriaIcone from './CategoriaIcone'
import MapaBase from './MapaBase'
import Pin from './Pin'

interface MapaPreviaProps {
  relatos: Relato[]
  selecionadoId: number | null
  onSelecionar?: (id: number) => void
  /**
   * tela     = /mapa (preenche a altura, com popover do relato)
   * ficha    = detalhe do relato (um pin, sem interação)
   */
  variante?: 'tela' | 'ficha'
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
 * Card do relato selecionado: fica fixo na base do mapa (canto esquerdo no desktop, largura toda no celular).
 * Os pins ficam na parte de cima do mapa, então o card nunca cobre outro pin.
 */
function Popover({ relato }: { relato: Relato }) {
  return (
    <div className="surgir absolute inset-x-3 bottom-3 z-20 rounded-painel border border-line bg-panel p-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-96">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-alert-bg px-2.5 py-1 text-[13px] font-bold text-alert-text">
          <CategoriaIcone nome={relato.categoriaNome} className="size-3.5" />
          {relato.categoriaNome}
        </span>
      </p>
      <p className="mt-2 font-display text-lg font-extrabold leading-snug tracking-[-0.01em]">{relato.titulo}</p>
      <p className="mt-1 text-sm text-muted">
        {relato.regiaoNome}, {tempoDecorrido(relato.dataOcorrencia)}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Carimbo />
        <Link to={`/relatos/${relato.id}`} className="inline-flex min-h-10 items-center font-bold text-link underline-offset-4 hover:underline">
          Ver relato
        </Link>
      </div>
    </div>
  )
}

/**
 * Posiciona os relatos pela latitude/longitude sobre o fundo ilustrado (MapaBase).
 * Quando o Leaflet for liberado, este componente é o único a trocar: as props continuam as mesmas.
 */
export default function MapaPrevia({ relatos, selecionadoId, onSelecionar, variante = 'ficha', className = '' }: MapaPreviaProps) {
  const lats = relatos.map((r) => r.latitude)
  const lngs = relatos.map((r) => r.longitude)
  const margem = 0.004
  const minLat = Math.min(...lats) - margem
  const maxLat = Math.max(...lats) + margem
  const minLng = Math.min(...lngs) - margem
  const maxLng = Math.max(...lngs) + margem

  // 10%–90% para os pins não encostarem na borda
  const x = (r: Relato) => 10 + ((r.longitude - minLng) / (maxLng - minLng || 1)) * 80
  // Na tela cheia os pins ficam entre 14% e 62% da altura: a base fica livre para o card do relato
  const [yIni, yFaixa] = variante === 'tela' ? [14, 48] : [18, 66]
  const y = (r: Relato) => yIni + ((maxLat - r.latitude) / (maxLat - minLat || 1)) * yFaixa

  const selecionado = relatos.find((r) => r.id === selecionadoId) ?? null
  const interativo = variante !== 'ficha' && !!onSelecionar

  const tamanhoContainer = {
    tela: 'h-full min-h-[420px]', // sem moldura: o mapa vai até a borda da tela
    ficha: 'aspect-[4/3]',
  }[variante]

  return (
    <div className={`relative w-full overflow-hidden ${variante === 'tela' ? '' : 'rounded-mapa border border-line'} ${tamanhoContainer} ${className}`}>
      <MapaBase />
      {relatos.map((r, i) => {
        const ativo = selecionadoId === r.id || variante === 'ficha'
        // Os pins "pousam" um a um quando o mapa aparece (entrada em sequência)
        const pin = (
          <span className="pousar grid" style={{ animationDelay: `${150 + i * 70}ms` }}>
            <Pin className={ativo ? 'size-12' : 'size-8'} ativo={ativo} />
          </span>
        )
        const posicao = { left: `${x(r)}%`, top: `${y(r)}%` }
        if (!interativo) {
          return (
            <span key={r.id} style={posicao} className="absolute grid -translate-x-1/2 -translate-y-[85%] place-items-end justify-center">
              {pin}
            </span>
          )
        }
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelecionar?.(r.id)}
            style={posicao}
            className={`absolute grid min-h-11 min-w-11 -translate-x-1/2 -translate-y-[85%] place-items-end justify-center transition-transform duration-150 hover:scale-110 ${ativo ? 'z-10' : ''}`}
            aria-label={`${r.titulo}, ${r.logradouro}`}
            aria-pressed={ativo}
          >
            {ativo && <span className="pulso absolute bottom-0 left-1/2 size-6 -translate-x-1/2 translate-y-1/2 rounded-full bg-alert/50" aria-hidden />}
            {pin}
          </button>
        )
      })}

      {variante === 'tela' && selecionado && <Popover relato={selecionado} />}

      <SeloIlustrativo />
      {variante !== 'ficha' && (
        <p className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-panel/95 px-3 py-1.5 text-[13px] font-bold text-ink shadow-sm max-lg:hidden">
          <Pin className="size-4" /> Relato aprovado
        </p>
      )}
    </div>
  )
}
