import { LinkBotao } from '../components/Button'
import { Carregando, ListaVazia, MensagemErro } from '../components/EstadoTela'
import ItemRelato from '../components/ItemRelato'
import PageHeader from '../components/PageHeader'
import { useRequisicao } from '../hooks/useRequisicao'
import { listarRelatos } from '../services/relatos'

export default function Relatos() {
  const relatos = useRequisicao(() => listarRelatos('APROVADO'), [])

  // Do mais recente para o mais antigo (cópia antes de ordenar: o sort altera o array)
  const filtrados = [...(relatos.dados ?? [])].sort((a, b) => b.dataOcorrencia.localeCompare(a.dataOcorrencia))

  return (
    <>
      <PageHeader titulo="Relatos" marco="pin">
        <p>Tudo o que passou pela moderação, do mais recente para o mais antigo.</p>
      </PageHeader>

      {relatos.carregando && <Carregando texto="Buscando relatos" />}
      {relatos.erro && <MensagemErro titulo="Não foi possível carregar os relatos" mensagem={relatos.erro.message} onTentarNovamente={relatos.recarregar} />}
      {relatos.dados && filtrados.length === 0 && (
        <ListaVazia titulo="Nenhum relato publicado ainda.">
          <LinkBotao to="/enviar-relato">Enviar relato</LinkBotao>
        </ListaVazia>
      )}

      {filtrados.length > 0 && (
        <ul className="border-t border-line">
          {filtrados.map((r, i) => (
            <li key={r.id}>
              <ItemRelato relato={r} indice={i} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
