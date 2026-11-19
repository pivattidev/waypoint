import PageHeader from '../components/PageHeader'

// Define os campos de cada pergunta
interface Pergunta {
  pergunta: string
  resposta: string
}

// Perguntas iniciais do FAQ
const perguntas: Pergunta[] = [
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

          <div className="border-t border-line">
        {perguntas.map((item) => (
          <PerguntaFaq key={item.pergunta} item={item} />
        ))}
      </div>
    </>  
  )
}
