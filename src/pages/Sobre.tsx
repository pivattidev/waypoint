import type { ReactNode } from 'react'
import PageHeader from '../components/PageHeader'
import Revelar from '../components/Revelar'

/**
 * Princípios em forma de frase: cada um é uma afirmação curta e grande, com a explicação ao lado.
 * (Sem cartões com ícone: o texto é o elemento visual, como no bloco "O problema".)
 */
const principios = [
  {
    frase: 'O relato não sabe quem você é.',
    texto: 'Não guardamos nome, e-mail nem IP de quem enviou. O anonimato está no próprio banco de dados, não numa promessa.',
  },
  {
    frase: 'Nada vai ao mapa sem ser lido.',
    texto: 'Todo relato entra como pendente. A moderação aprova, ou rejeita com motivo, antes de ele aparecer para alguém.',
  },
  {
    frase: 'Vale o que é recente e perto.',
    texto: 'Os relatos são organizados por região e por data, para mostrar o que importa no trajeto de hoje.',
  },
]

const ods = [
  { n: '11', titulo: 'Cidades e comunidades sustentáveis', texto: 'Espaços públicos mais seguros e acessíveis para quem anda a pé.' },
  { n: '10', titulo: 'Redução das desigualdades', texto: 'Informação de segurança aberta e gratuita, para qualquer bairro.' },
]

/**
 * Seção no padrão do site: nome à esquerda (coluna fixa), conteúdo à direita, linha fina em cima.
 * Surge ao rolar (Revelar).
 */
function Secao({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <Revelar
      como="section"
      aria-labelledby={id}
      className="grid gap-x-16 gap-y-6 border-t border-line pt-10 lg:grid-cols-[220px_minmax(0,1fr)]"
    >
      <h2 id={id} className="text-lg font-extrabold">
        {titulo}
      </h2>
      <div className="min-w-0">{children}</div>
    </Revelar>
  )
}

export default function Sobre() {
  return (
    <>
      <PageHeader titulo="Informação de rua, de quem anda na rua">
        <p>
          O WayPoint é um mapa com rotas a pé e relatos recentes de segurança enviados pela comunidade. Um projeto da Global
          Solution 2026/2 da FIAP, tema CitizenTech.
        </p>
      </PageHeader>

      <div className="flex flex-col gap-20">
        <Secao id="problema" titulo="O problema">
          {/* TODO: acrescentar dados e fontes, alinhados com o PDF de Eng. de Software (Jardim). */}
          <p className="max-w-3xl font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold leading-[1.2] tracking-[-0.02em]">
            Quem anda a pé decide o caminho com pouca informação: não sabe se a rua está iluminada, se a calçada está inteira ou
            se algo aconteceu ali ontem.
          </p>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Essa informação existe. Ela está com quem passou por lá, mas fica espalhada em grupos de mensagem, sem conferência e
            sem proteger quem conta.
          </p>
        </Secao>

        <Secao id="principios" titulo="Princípios">
          {/* Uma frase grande por linha, com a explicação ao lado: o texto é o próprio desenho */}
          <ul className="divide-y divide-line">
            {principios.map((p, i) => (
              <Revelar
                key={p.frase}
                como="li"
                indice={i}
                className="grid gap-x-12 gap-y-3 py-8 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-baseline"
              >
                <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold leading-[1.15] tracking-[-0.02em]">{p.frase}</p>
                <p className="max-w-xl text-lg text-muted">{p.texto}</p>
              </Revelar>
            ))}
          </ul>
        </Secao>

        <Secao id="ods" titulo="ODS da ONU">
          {/* Número em cima, título e texto embaixo: tudo alinhado à mesma margem esquerda */}
          <ul className="grid gap-12 md:grid-cols-2 md:gap-16">
            {ods.map((o, i) => (
              <Revelar key={o.n} como="li" indice={i}>
                {/* Só o número (a seção já diz "ODS da ONU"); o leitor de tela ouve "ODS 11" */}
                <p className="tabular font-display text-7xl font-extrabold leading-none tracking-[-0.05em] text-link">
                  <span className="sr-only">ODS </span>
                  {o.n}
                </p>
                <h3 className="mt-5 text-xl leading-tight">{o.titulo}</h3>
                <p className="mt-2 max-w-md text-[15px] text-muted">{o.texto}</p>
              </Revelar>
            ))}
          </ul>
        </Secao>
      </div>
    </>
  )
}
