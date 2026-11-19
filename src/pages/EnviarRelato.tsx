import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Campo, { AreaTexto, Entrada, Selecao } from '../components/Campo'
import { Carregando, MensagemErro } from '../components/EstadoTela'
import PageHeader from '../components/PageHeader'
import Pin from '../components/Pin'
import { useRequisicao } from '../hooks/useRequisicao'
import { mensagemDeErro } from '../services/api'
import { listarCategorias, listarRegioes } from '../services/regioes'
import { enviarRelato } from '../services/relatos'
import type { Relato } from '../types/relato'

interface FormRelato {
  regiaoId: string
  logradouro: string
  categoriaId: string
  titulo: string
  descricao: string
  dataOcorrencia: string
  tags: string
}

type CampoForm = keyof FormRelato
type ErrosRelato = Partial<Record<CampoForm, string>>

const vazio: FormRelato = { regiaoId: '', logradouro: '', categoriaId: '', titulo: '', descricao: '', dataOcorrencia: '', tags: '' }

/** Validação antes de enviar (regra de UX da GS). Devolve só os erros dos campos pedidos. */
function validar(form: FormRelato, campos: CampoForm[]): ErrosRelato {
  const erros: ErrosRelato = {}
  const checar = (campo: CampoForm) => campos.includes(campo)
  if (checar('regiaoId') && !form.regiaoId) erros.regiaoId = 'Escolha a região.'
  if (checar('logradouro') && form.logradouro.trim().length < 3) erros.logradouro = 'Informe a rua, praça ou um ponto de referência.'
  if (checar('categoriaId') && !form.categoriaId) erros.categoriaId = 'Escolha o tipo de relato.'
  if (checar('titulo')) {
    if (form.titulo.trim().length < 5) erros.titulo = 'Resuma em pelo menos 5 letras.'
    else if (form.titulo.length > 100) erros.titulo = 'Use no máximo 100 caracteres.'
  }
  if (checar('descricao') && form.descricao.trim().length < 20) erros.descricao = 'Descreva o que aconteceu em pelo menos 20 letras.'
  if (checar('dataOcorrencia')) {
    if (!form.dataOcorrencia) erros.dataOcorrencia = 'Informe quando aconteceu.'
    else if (new Date(form.dataOcorrencia) > new Date()) erros.dataOcorrencia = 'A data não pode estar no futuro.'
  }
  return erros
}

const todosOsCampos: CampoForm[] = ['regiaoId', 'logradouro', 'categoriaId', 'titulo', 'descricao', 'dataOcorrencia', 'tags']

/** id do controle de cada campo, para levar o foco ao primeiro erro. */
const ID_CAMPO: Record<CampoForm, string> = {
  regiaoId: 'regiao',
  logradouro: 'logradouro',
  categoriaId: 'categoria',
  titulo: 'titulo',
  descricao: 'descricao',
  dataOcorrencia: 'data',
  tags: 'tags',
}

/** Foca o primeiro campo com erro (depois do React desenhar a mensagem). */
function focarPrimeiroErro(erros: ErrosRelato) {
  const primeiro = todosOsCampos.find((c) => erros[c])
  if (primeiro) window.setTimeout(() => document.getElementById(ID_CAMPO[primeiro])?.focus(), 0)
}

export default function EnviarRelato() {
  const regioes = useRequisicao(listarRegioes, [])
  const categorias = useRequisicao(listarCategorias, [])

  const [form, setForm] = useState<FormRelato>(vazio)
  const [erros, setErros] = useState<ErrosRelato>({})
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)
  const [enviado, setEnviado] = useState<Relato | null>(null)

  const atualizar = (campo: CampoForm, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    const novos = validar(form, todosOsCampos)
    setErros(novos)
    if (Object.keys(novos).length > 0) {
      focarPrimeiroErro(novos)
      return
    }

    setEnviando(true)
    setErroEnvio(null)
    try {
      const criado = await enviarRelato(Number(form.regiaoId), {
        categoriaId: Number(form.categoriaId),
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        logradouro: form.logradouro.trim(),
        latitude: null,
        longitude: null,
        dataOcorrencia: form.dataOcorrencia,
        tags: form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      })
      setEnviado(criado)
      setForm(vazio)
      // A confirmação é curta: volta ao topo para ela aparecer inteira
      window.scrollTo({ top: 0 })
    } catch (e) {
      // Feedback da API (400 de validação, 404 de região...) aparece como veio do Java
      setErroEnvio(mensagemDeErro(e))
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center" role="status">
        {/* O pin "pousa": resposta à ação de enviar */}
        <Pin className="pousar size-16" />
        <h1 className="entrar mt-6 text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold leading-none tracking-[-0.04em]" style={{ '--i': 3 } as CSSProperties}>
          Relato enviado
        </h1>
        <p className="entrar mt-4 text-lg text-muted" style={{ '--i': 4 } as CSSProperties}>
          Ele aparece no mapa depois da moderação. Nada sobre você foi guardado.
        </p>
        <div className="entrar mt-9 flex flex-wrap justify-center gap-3" style={{ '--i': 5 } as CSSProperties}>
          <Button onClick={() => setEnviado(null)}>Enviar outro relato</Button>
          <Link to="/mapa" className="inline-flex min-h-11 items-center px-5 font-bold text-link underline-offset-4 hover:underline">
            Ver o mapa
          </Link>
        </div>
      </div>
    )
  }

  const carregandoListas = regioes.carregando || categorias.carregando
  const erroListas = regioes.erro ?? categorias.erro

  return (
    <>
      <PageHeader titulo="O que você viu no caminho?" marco="pin">
        <p>Não pedimos nome, e-mail nem cadastro. O relato aparece no mapa depois da moderação.</p>
      </PageHeader>

      {carregandoListas && <Carregando texto="Preparando o formulário" formato="bloco" />}
      {erroListas && (
        <MensagemErro
          titulo="Não foi possível preparar o formulário"
          mensagem={erroListas.message}
          onTentarNovamente={() => {
            regioes.recarregar()
            categorias.recarregar()
          }}
        />
      )}

      {regioes.dados && categorias.dados && (
        <form noValidate onSubmit={enviar} className="grid max-w-3xl gap-6 md:grid-cols-2">
          {erroEnvio && (
            <p role="alert" className="rounded-ctl bg-alert-bg px-4 py-3 font-bold text-alert-text md:col-span-2">
              {erroEnvio}
            </p>
          )}
          <Campo id="regiao" rotulo="Região" erro={erros.regiaoId}>
            <Selecao id="regiao" value={form.regiaoId} erro={!!erros.regiaoId} onChange={(e) => atualizar('regiaoId', e.target.value)}>
              <option value="">Selecione</option>
              {regioes.dados.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nome}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo id="logradouro" rotulo="Local" erro={erros.logradouro} dica="Rua e número aproximado, ou um ponto de referência">
            <Entrada id="logradouro" autoComplete="off" value={form.logradouro} erro={!!erros.logradouro} onChange={(e) => atualizar('logradouro', e.target.value)} />
          </Campo>
          <Campo id="categoria" rotulo="Tipo de relato" erro={erros.categoriaId}>
            <Selecao id="categoria" value={form.categoriaId} erro={!!erros.categoriaId} onChange={(e) => atualizar('categoriaId', e.target.value)}>
              <option value="">Selecione</option>
              {categorias.dados.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo id="titulo" rotulo="Título" erro={erros.titulo} dica="Ex.: Trecho escuro perto da escadaria">
            <Entrada id="titulo" autoComplete="off" maxLength={100} value={form.titulo} erro={!!erros.titulo} onChange={(e) => atualizar('titulo', e.target.value)} />
          </Campo>
          <div className="md:col-span-2">
            <Campo id="descricao" rotulo="Descrição" erro={erros.descricao} dica="Descreva o local e a situação. Não inclua nomes nem dados pessoais.">
              <AreaTexto id="descricao" rows={7} value={form.descricao} erro={!!erros.descricao} onChange={(e) => atualizar('descricao', e.target.value)} />
            </Campo>
          </div>
          <Campo id="data" rotulo="Data e hora" erro={erros.dataOcorrencia}>
            <Entrada id="data" type="datetime-local" value={form.dataOcorrencia} erro={!!erros.dataOcorrencia} onChange={(e) => atualizar('dataOcorrencia', e.target.value)} />
          </Campo>
          <Campo id="tags" rotulo="Tags (opcional)" dica="Separe por vírgula. Ex.: noite, ônibus">
            <Entrada id="tags" autoComplete="off" value={form.tags} onChange={(e) => atualizar('tags', e.target.value)} />
          </Campo>
          <div className="md:col-span-2">
            <Button type="submit" carregando={enviando}>
              {enviando ? 'Enviando…' : 'Enviar relato'}
            </Button>
          </div>
        </form>
      )}
    </>
  )
}
