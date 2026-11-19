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

export default function Faq() {
  return (
    <>
    <PageHeader titulo="Perguntas frequentes">
      <p>Tire suas dúvidas sobre os relatos e o uso do WayPoint.
          Toque numa pergunta para ver a resposta.</p>
    </PageHeader>

    <div className="border-t border-line">
        {perguntas.map((item) => (
          <details key={item.pergunta} className="border-b border-line">
            <summary className="cursor-pointer py-5 text-lg font-bold">
              {item.pergunta}
            </summary>

            <p className="resposta max-w-3xl pb-6 text-[17px] leading-relaxed text-muted">
              {item.resposta}
            </p>
          </details>
        ))}
      </div>
    </>  
  )
}
