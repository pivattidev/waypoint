import { Link } from 'react-router-dom'
import type { Relato } from '../types/relato'
import { tempoDecorrido } from '../utils/formatar'
import Carimbo from './Carimbo'
import CategoriaIcone from './CategoriaIcone'
import MapaBase from './MapaBase'
import Pin from './Pin'

/**
 * Cartão do pin (mapa da Home): surge junto do pin com animação e leva ao relato.
 * Fica acima do pin quando ele está na metade de baixo do mapa, e abaixo quando está na de cima.
 */
function CartaoPin({ relato, x, y }: { relato: Relato; x: number; y: number }) {
  // Abre AO LADO do pin (direita se o pin está à esquerda, e vice-versa): não cobre os pins vizinhos de cima e de baixo
  const aDireita = x < 50
  return (
    <Link
      to={`/relatos/${relato.id}`}
      className={`surgir group absolute z-30 w-60 -translate-y-[calc(50%+1rem)] rounded-painel border border-line bg-panel p-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] transition-colors hover:border-teal ${
        aDireita ? 'translate-x-6' : '-translate-x-[calc(100%+1.5rem)]'
      }`}
      style={{ left: `${x}%`, top: `${Math.min(Math.max(y, 22), 80)}%` }}
    >
      <span className="flex items-center gap-1.5 text-[13px] font-bold text-alert-text">
        <CategoriaIcone nome={relato.categoriaNome} className="size-3.5" />
        {relato.categoriaNome}
      </span>
      <span className="mt-1.5 block font-display text-[17px] font-bold leading-snug text-ink">{relato.titulo}</span>
      <span className="mt-1 block text-[13px] text-muted">
        {relato.logradouro}, {tempoDecorrido(relato.dataOcorrencia)}
      </span>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-link">
        Ver relato
        <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  )
}

interface MapaPreviaProps {
  relatos: Relato[]
  selecionadoId: number | null
  onSelecionar?: (id: number) => void
  /**
   * compacto = Home (alto, nome da rua no pin em foco)
   * tela     = /mapa (preenche a altura, com popover do relato)
   * ficha    = detalhe do relato (um pin, sem interação)
   */
  variante?: 'compacto' | 'tela' | 'ficha'
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
export default function MapaPrevia({ relatos, selecionadoId, onSelecionar, variante = 'compacto', className = '' }: MapaPreviaProps) {
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
    compacto: 'aspect-[4/5]',
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
            onMouseEnter={variante === 'compacto' ? () => onSelecionar?.(r.id) : undefined}
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

      {/* Home: passar o mouse num pin abre um cartão animado e clicável junto dele */}
      {variante === 'compacto' && selecionado && <CartaoPin key={selecionado.id} relato={selecionado} x={x(selecionado)} y={y(selecionado)} />}

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