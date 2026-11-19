import { useState, type FormEvent } from 'react'
import Button from '../components/Button'
import Campo, { AreaTexto, Entrada } from '../components/Campo'
import PageHeader from '../components/PageHeader'

interface FormContato {
  nome: string
  email: string
  mensagem: string
}

type ErrosContato = Partial<Record<keyof FormContato, string>>

const vazio: FormContato = { nome: '', email: '', mensagem: '' }

function validar(form: FormContato): ErrosContato {
  const erros: ErrosContato = {}
  if (form.nome.trim().length < 2) erros.nome = 'Digite seu nome.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) erros.email = 'Digite um e-mail válido, como nome@exemplo.com.'
  if (form.mensagem.trim().length < 10) erros.mensagem = 'Escreva a mensagem com pelo menos 10 letras.'
  return erros
}

export default function Contato() {
  const [form, setForm] = useState<FormContato>(vazio)
  const [erros, setErros] = useState<ErrosContato>({})

  const atualizar = (campo: keyof FormContato, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  const enviar = (evento: FormEvent) => {
    evento.preventDefault()
    const novosErros = validar(form)
    setErros(novosErros)
    // Leva o foco ao primeiro campo com erro
    const primeiro = (['nome', 'email', 'mensagem'] as const).find((c) => novosErros[c])
    if (primeiro) {
      document.getElementById(primeiro)?.focus()
      return
    }
  }

  return (
    <>
      <PageHeader titulo="Contato">
        <p>Sugestões, parcerias ou dúvidas sobre o projeto. Respondemos pelo e-mail que você informar.</p>
      </PageHeader>

      <form noValidate onSubmit={enviar} className="flex max-w-3xl flex-col gap-6">
        <Campo id="nome" rotulo="Nome" erro={erros.nome}>
          <Entrada id="nome" name="nome" autoComplete="name" value={form.nome} erro={!!erros.nome} onChange={(e) => atualizar('nome', e.target.value)} />
        </Campo>
        <Campo id="email" rotulo="E-mail" erro={erros.email} dica="Só para responder você. Não vai para nenhum relato.">
          <Entrada id="email" name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} erro={!!erros.email} onChange={(e) => atualizar('email', e.target.value)} />
        </Campo>
        <Campo id="mensagem" rotulo="Mensagem" erro={erros.mensagem}>
          <AreaTexto id="mensagem" name="mensagem" rows={9} value={form.mensagem} erro={!!erros.mensagem} onChange={(e) => atualizar('mensagem', e.target.value)} />
        </Campo>
        <Button type="submit" className="mt-2 self-start">
          Escrever e-mail
        </Button>
      </form>
    </>
  )
}
