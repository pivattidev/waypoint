import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <section className="p-8">
      <p className="text-sm font-bold">Erro 404</p>
      <h1 className="text-4xl font-bold">Rua sem saída</h1>
      <p className="mt-2">Essa página não existe ou mudou de endereço.</p>
      <Link to="/" className="mt-4 inline-block underline">
        Voltar ao início
      </Link>
    </section>
  )
}
