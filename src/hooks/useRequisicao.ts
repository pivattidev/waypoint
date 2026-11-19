import { useEffect, useState, type DependencyList } from 'react'
import { ApiError } from '../services/api'

interface EstadoRequisicao<T> {
  dados: T | null
  carregando: boolean
  erro: ApiError | null
  recarregar: () => void
}

/** O que chegou da última busca, junto com a "chave" da busca que trouxe esse resultado. */
interface Resultado<T> {
  chave: string
  dados: T | null
  erro: ApiError | null
}

/**
 * Executa uma chamada da camada de services e controla carregando / erro / dados.
 * A "chave" junta as dependências e a versão: enquanto o resultado guardado for de outra chave,
 * a busca atual ainda está carregando. Ignora a resposta se o componente sair da tela antes dela chegar.
 */
export function useRequisicao<T>(buscar: () => Promise<T>, deps: DependencyList): EstadoRequisicao<T> {
  const [versao, setVersao] = useState(0)
  const [resultado, setResultado] = useState<Resultado<T> | null>(null)
  const chave = JSON.stringify([...deps, versao])

  useEffect(() => {
    let ativo = true

    buscar()
      .then((dados) => {
        if (ativo) setResultado({ chave, dados, erro: null })
      })
      .catch((e: unknown) => {
        if (!ativo) return
        const erro =
          e instanceof ApiError
            ? e
            : new ApiError({ status: 0, erro: 'Erro', mensagem: 'Algo deu errado. Tente novamente.', caminho: '' })
        setResultado({ chave, dados: null, erro })
      })

    return () => {
      ativo = false
    }
    // buscar muda a cada render; quem decide quando buscar de novo é a chave
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave])

  const carregando = resultado?.chave !== chave

  return {
    // Enquanto recarrega, mantém os dados anteriores na tela (não pisca vazio)
    dados: resultado?.dados ?? null,
    carregando,
    erro: carregando ? null : (resultado?.erro ?? null),
    recarregar: () => setVersao((v) => v + 1),
  }
}
