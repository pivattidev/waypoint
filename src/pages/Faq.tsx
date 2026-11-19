import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'

// Define os campos de cada pergunta
interface Pergunta {
  pergunta: string
  resposta: string
}

interface GrupoFaq {
  id: string
  titulo: string
  perguntas: Pergunta[]
}

// Perguntas iniciais do FAQ
const grupos: GrupoFaq[] = [
    {
    id: 'relatos',
    titulo: 'Envio de relatos',
    perguntas: [
      {
        pergunta: 'O que eu não devo escrever no relato?',
        resposta:
          'Evite nomes, placas de veículos e informações que identifiquem pessoas. Descreva as condições do local e o problema encontrado.',
      },
      {
        pergunta: 'Como escrever um relato útil?',
        resposta:
          'Informe o local e descreva o problema com clareza, como um poste apagado, uma calçada danificada ou um bloqueio na passagem.',
      },
      {
        pergunta: 'Para que servem os relatos?',
        resposta:
          'Os relatos ajudam outros pedestres a conhecer as condições dos caminhos e a planejar seus trajetos.',
      },
    ],
  },
  {
    id: 'moderacao',
    titulo: 'Moderação',
    perguntas: [
      {
        pergunta: 'Por que meu relato pode não aparecer no mapa?',
        resposta:
          'O relato pode estar aguardando análise da moderação. Confira também se os filtros do mapa permitem mostrar esse tipo de ocorrência.',
      },
      {
        pergunta: 'Como evitar problemas na análise do relato?',
        resposta:
          'Descreva uma situação relacionada ao trajeto de pedestres, com informações claras sobre o local e sem expor outras pessoas.',
      },
    ],
  },
  {
    id: 'uso',
    titulo: 'Uso do mapa',
    perguntas: [
      {
        pergunta: 'Como consultar as informações de um local?',
        resposta:
          'Acesse a página do mapa e consulte os relatos disponíveis na região do seu trajeto.',
      },
      {
        pergunta: 'Um relato descreve a situação atual da rua?',
        resposta:
          'As condições do local podem mudar. Confira a data do relato e considere outras informações disponíveis antes de escolher seu caminho.',
      },
      {
        pergunta: 'O que significa uma região sem relatos?',
        resposta:
          'Significa que não há relatos disponíveis para aquela região na consulta. Isso não garante que o local esteja livre de problemas.',
      },
    ],
  },
]

// Componente reutilizado para mostrar cada pergunta
function PerguntaFaq({ item }: { item: Pergunta }) {
  return (
    <details className="group border-b border-line">
      <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-lg font-bold transition-colors hover:text-link">
        {item.pergunta}

        {/* O sinal de + gira quando a pergunta está aberta */}
        <svg
          viewBox="0 0 24 24"
          className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45 group-open:text-link"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>

      <p className="resposta max-w-3xl pb-6 pr-10 text-[17px] leading-relaxed text-muted">
        {item.resposta}
      </p>
    </details>
  )
}

export default function Faq() {
  return (
    <>
    <PageHeader titulo="Perguntas frequentes">
      <p>Tire suas dúvidas sobre os relatos e o uso do WayPoint.
          Toque numa pergunta para ver a resposta.</p>
    </PageHeader>

    <div className="flex flex-col gap-16">
      {grupos.map((g) => (
      <section key={g.id} id={g.id} aria-labelledby={`titulo-${g.id}`} 
      className="grid gap-x-16 gap-y-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <h2
    id={`titulo-${g.id}`}
    className="text-lg font-extrabold lg:sticky lg:top-28 lg:self-start lg:pt-5">
    {g.titulo}
  </h2>
      <div className="border-t border-line">
      {g.perguntas.map((item) => (
      <PerguntaFaq key={item.pergunta} item={item} />
    ))}
  </div>
    </section>
    ))}
      <div className="grid gap-x-16 gap-y-2 border-t border-line pt-10 lg:grid-cols-[220px_minmax(0,1fr)]">
      <p className="text-lg font-extrabold">Não achou?</p>
      <p className="text-[17px] text-muted">
        Envie sua dúvida para a equipe pela página de{' '}
        <Link
        to="/contato"
        className="font-bold text-link underline underline-offset-4">
        contato
        </Link>.
        </p>
      </div>
    </div>
  </>  
  )
}
