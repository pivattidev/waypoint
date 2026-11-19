import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link } from 'react-router-dom' 
import Button from '../components/Button'
import Campo, { AreaTexto, Entrada } from '../components/Campo'
import PageHeader from '../components/PageHeader'

// TODO: trocar pelo e-mail oficial do grupo. A API Java não tem endpoint de contato.
const EMAIL_CONTATO = 'contato.waypoint@exemplo.com'

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

/**
 * Contato com validação. Como não existe endpoint na API, o envio monta um e-mail pronto (mailto:)
 * em vez de fingir que a mensagem foi enviada.
 */

export default function Contato() {
  const [form, setForm] = useState<FormContato>(vazio)
  const [erros, setErros] = useState<ErrosContato>({})
  const [pronto, setPronto] = useState(false)
  const [linkGmail, setLinkGmail] = useState('')

  const atualizar = (campo: keyof FormContato, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
    setPronto(false)
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

    const assunto = encodeURIComponent(`Contato pelo site WayPoint: ${form.nome.trim()}`)
    const corpo = encodeURIComponent(`${form.mensagem.trim()}\n\nResponder para: ${form.email.trim()}`)

    // Alternativa para quem não tem app de e-mail configurado: abre o Gmail no navegador
    setLinkGmail(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_CONTATO)}&su=${assunto}&body=${corpo}`,
    )

    window.location.href = `mailto:${EMAIL_CONTATO}?subject=${assunto}&body=${corpo}`
    setPronto(true)
  }

  return (
    <>
      <PageHeader titulo="Contato">
        <p>Sugestões, parcerias ou dúvidas sobre o projeto. Respondemos pelo e-mail que você informar.</p>
      </PageHeader>

      {/* Proporção 2/3 + 1/3: o formulário ocupa a maior parte da tela, os canais ficam na lateral */}
      <div className="grid gap-14 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:gap-20">
      <form noValidate onSubmit={enviar} className="entrar flex flex-col gap-6" style={{ '--i': 3 } as CSSProperties}>
          {pronto && (
  <p role="status" className="entrar border-l-2 border-teal pl-4 text-ink">
    <strong className="block">Mensagem pronta no seu app de e-mail.</strong>
    <span className="text-muted">
      Confira e envie por lá. Se nada abriu,{' '}
      <a href={linkGmail} target="_blank" rel="noreferrer" className="font-bold text-link underline underline-offset-4">
        abrir no Gmail
      </a>{' '}
      ou escreva para {EMAIL_CONTATO}.
    </span>
  </p>
)}
          {/* Nome e e-mail lado a lado: campos curtos não precisam da largura toda */}
          <div className="grid gap-6 md:grid-cols-2">
            <Campo id="nome" rotulo="Nome" erro={erros.nome}>
              <Entrada id="nome" name="nome" autoComplete="name" value={form.nome} erro={!!erros.nome} onChange={(e) => atualizar('nome', e.target.value)} />
            </Campo>
            <Campo id="email" rotulo="E-mail" erro={erros.email} dica="Só para responder você. Não vai para nenhum relato.">
              <Entrada id="email" name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} erro={!!erros.email} onChange={(e) => atualizar('email', e.target.value)} />
            </Campo>
          </div>
          <Campo id="mensagem" rotulo="Mensagem" erro={erros.mensagem}>
            <AreaTexto id="mensagem" name="mensagem" rows={9} value={form.mensagem} erro={!!erros.mensagem} onChange={(e) => atualizar('mensagem', e.target.value)} />
          </Campo>
          <Button type="submit" className="mt-2 self-start max-sm:self-stretch">
            Escrever e-mail
          </Button>
        </form>
      {/* Outros canais: na lateral, separados só por uma linha */}
        <aside
          className="entrar border-t border-line pt-8 xl:sticky xl:top-28 xl:self-start xl:border-l xl:border-t-0 xl:pl-12 xl:pt-0"
          style={{ '--i': 4 } as CSSProperties}        >
          <h2 className="text-xl">Outros canais</h2>
          <dl className="mt-6 space-y-6 text-[15px]">
            <div>
              <dt className="font-bold text-muted">E-mail</dt>
              <dd className="mt-1">
                <a href={`mailto:${EMAIL_CONTATO}`} className="font-bold text-link underline-offset-4 hover:underline [overflow-wrap:anywhere]">
                  {EMAIL_CONTATO}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-muted">GitHub</dt>
              {/* TODO: link do repositório público no GitHub */}
              <dd className="mt-1 text-ink-2">Em breve</dd>
            </div>
            <div>
              <dt className="font-bold text-muted">Relatos de segurança</dt>
              <dd className="mt-1 text-ink-2">
                Use o{' '}
                <Link to="/enviar-relato" className="font-bold text-link underline underline-offset-4">
                  envio anônimo
                </Link>
                , não este formulário.
              </dd>
            </div>
          </dl>
          <p className="mt-8 flex items-center gap-2.5 text-[15px] font-bold">
            <span className="size-2 shrink-0 rounded-full bg-alert" aria-hidden />
            Em emergência, ligue 190.
          </p>
        </aside>
      </div>
    </>
  )
}