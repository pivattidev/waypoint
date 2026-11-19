import { useState, type FormEvent } from 'react'
import Button from '../components/Button'
import Campo, { AreaTexto, Entrada, Selecao } from '../components/Campo'
import { Carregando, MensagemErro } from '../components/EstadoTela'
import PageHeader from '../components/PageHeader'
import { useRequisicao } from '../hooks/useRequisicao'
import { listarCategorias, listarRegioes } from '../services/regioes'

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

const vazio: FormRelato = { regiaoId: '', logradouro: '', categoriaId: '', titulo: '', descricao: '', dataOcorrencia: '', tags: '' }

export default function EnviarRelato() {
  const regioes = useRequisicao(listarRegioes, [])
  const categorias = useRequisicao(listarCategorias, [])

  const [form, setForm] = useState<FormRelato>(vazio)

  const atualizar = (campo: CampoForm, valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  const enviar = (evento: FormEvent) => {
    evento.preventDefault()
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
        <form onSubmit={enviar} className="grid max-w-3xl gap-6 md:grid-cols-2">
          <Campo id="regiao" rotulo="Região">
            <Selecao id="regiao" value={form.regiaoId} onChange={(e) => atualizar('regiaoId', e.target.value)}>
              <option value="">Selecione</option>
              {regioes.dados.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nome}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo id="logradouro" rotulo="Local" dica="Rua e número aproximado, ou um ponto de referência">
            <Entrada id="logradouro" autoComplete="off" value={form.logradouro} onChange={(e) => atualizar('logradouro', e.target.value)} />
          </Campo>
          <Campo id="categoria" rotulo="Tipo de relato">
            <Selecao id="categoria" value={form.categoriaId} onChange={(e) => atualizar('categoriaId', e.target.value)}>
              <option value="">Selecione</option>
              {categorias.dados.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Selecao>
          </Campo>
          <Campo id="titulo" rotulo="Título" dica="Ex.: Trecho escuro perto da escadaria">
            <Entrada id="titulo" autoComplete="off" maxLength={100} value={form.titulo} onChange={(e) => atualizar('titulo', e.target.value)} />
          </Campo>
          <div className="md:col-span-2">
            <Campo id="descricao" rotulo="Descrição" dica="Descreva o local e a situação. Não inclua nomes nem dados pessoais.">
              <AreaTexto id="descricao" rows={7} value={form.descricao} onChange={(e) => atualizar('descricao', e.target.value)} />
            </Campo>
          </div>
          <Campo id="data" rotulo="Data e hora">
            <Entrada id="data" type="datetime-local" value={form.dataOcorrencia} onChange={(e) => atualizar('dataOcorrencia', e.target.value)} />
          </Campo>
          <Campo id="tags" rotulo="Tags (opcional)" dica="Separe por vírgula. Ex.: noite, ônibus">
            <Entrada id="tags" autoComplete="off" value={form.tags} onChange={(e) => atualizar('tags', e.target.value)} />
          </Campo>
          <div className="md:col-span-2">
            <Button type="submit">Enviar relato</Button>
          </div>
        </form>
      )}
    </>
  )
}
