import { useState, type FormEvent } from 'react'
import Button from '../components/Button'
import Campo, { AreaTexto, Entrada } from '../components/Campo'
import PageHeader from '../components/PageHeader'

interface FormContato {
  nome: string
  email: string
  mensagem: string
}

const vazio: FormContato = { nome: '', email: '', mensagem: '' }

export default function Contato() {
  const [form, setForm] = useState<FormContato>(vazio)

  const atualizar = (campo: keyof FormContato, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  const enviar = (evento: FormEvent) => {
    evento.preventDefault()
  }

  return (
    <>
      <PageHeader titulo="Contato">
        <p>Sugestões, parcerias ou dúvidas sobre o projeto. Respondemos pelo e-mail que você informar.</p>
      </PageHeader>

      <form onSubmit={enviar} className="flex max-w-3xl flex-col gap-6">
        <Campo id="nome" rotulo="Nome">
          <Entrada id="nome" name="nome" autoComplete="name" value={form.nome} onChange={(e) => atualizar('nome', e.target.value)} />
        </Campo>
        <Campo id="email" rotulo="E-mail" dica="Só para responder você. Não vai para nenhum relato.">
          <Entrada id="email" name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} onChange={(e) => atualizar('email', e.target.value)} />
        </Campo>
        <Campo id="mensagem" rotulo="Mensagem">
          <AreaTexto id="mensagem" name="mensagem" rows={9} value={form.mensagem} onChange={(e) => atualizar('mensagem', e.target.value)} />
        </Campo>
        <Button type="submit" className="mt-2 self-start">
          Escrever e-mail
        </Button>
      </form>
    </>
  )
}
