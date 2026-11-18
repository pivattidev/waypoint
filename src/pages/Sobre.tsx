import type { ReactNode } from 'react'
import PageHeader from '../components/PageHeader'

/** Seção no padrão do site: nome à esquerda (coluna fixa), conteúdo à direita, linha fina em cima. */
function Secao({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-x-16 gap-y-6 border-t border-line pt-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <h2 id={id} className="text-lg font-extrabold">
        {titulo}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
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
      </div>
    </>
  )
}