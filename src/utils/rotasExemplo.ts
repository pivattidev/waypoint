/**
 * Dados do EXEMPLO ilustrado do hero: as duas rotas, onde caem os relatos e onde ficam os postes.
 * Coordenadas no sistema de desenho do MapaNoturno (1600 x 900). O cálculo real de rota vem da API.
 */

export type Ponto = [number, number]
export type IdRota = 'direta' | 'iluminada'

export const ORIGEM: Ponto = [760, 780]
export const DESTINO: Ponto = [1240, 220]

/** Cada rota é uma lista de pontos ligados por retas (as esquinas do caminho). */
export const ROTAS: Record<IdRota, Ponto[]> = {
  direta: [ORIGEM, [760, 500], [1080, 500], [1080, 220], DESTINO],
  iluminada: [ORIGEM, [1400, 780], [1400, 220], DESTINO],
}

/** Onde os relatos aprovados caem na rota direta (o trecho escuro). */
export const PONTOS_RELATO: Ponto[] = [
  [760, 630],
  [930, 500],
  [1080, 370],
]

/** Distância entre dois pontos (teorema de Pitágoras). */
function distancia([x0, y0]: Ponto, [x1, y1]: Ponto) {
  return Math.hypot(x1 - x0, y1 - y0)
}

/** Tamanho total da rota: soma de cada trecho reto. */
function comprimento(pontos: Ponto[]) {
  let total = 0
  for (let i = 1; i < pontos.length; i++) total += distancia(pontos[i - 1], pontos[i])
  return total
}

/**
 * Postes a cada `passo` unidades ao longo da rota.
 * t = fração do percurso (0 no início, 1 no fim): os postes acendem em sequência.
 */
function postes(pontos: Ponto[], passo: number) {
  const total = comprimento(pontos)
  const lista: { x: number; y: number; t: number }[] = []
  let percorrido = 0
  let proximo = passo / 2
  for (let i = 1; i < pontos.length; i++) {
    const [x0, y0] = pontos[i - 1]
    const [x1, y1] = pontos[i]
    const seg = distancia(pontos[i - 1], pontos[i])
    while (proximo <= percorrido + seg) {
      const f = (proximo - percorrido) / seg
      // O poste fica na calçada: 22 unidades para o lado do eixo da rua
      const nx = -(y1 - y0) / seg
      const ny = (x1 - x0) / seg
      lista.push({ x: x0 + (x1 - x0) * f + nx * 22, y: y0 + (y1 - y0) * f + ny * 22, t: proximo / total })
      proximo += passo
    }
    percorrido += seg
  }
  return lista
}

/** true se o ponto estiver perto de algum relato (ali o poste fica apagado). */
const pertoDeRelato = (x: number, y: number, raio: number) => PONTOS_RELATO.some((p) => distancia(p, [x, y]) < raio)

export const POSTES = {
  direta: postes(ROTAS.direta, 104).map((p) => ({ ...p, aceso: !pertoDeRelato(p.x, p.y, 150) })),
  iluminada: postes(ROTAS.iluminada, 104).map((p) => ({ ...p, aceso: true })),
}
