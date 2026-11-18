import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Tema = 'noite' | 'claro'

interface ThemeContextValor {
  tema: Tema
  alternarTema: () => void
}

const CHAVE = 'waypoint-tema'

const ThemeContext = createContext<ThemeContextValor | null>(null)

function lerEscolhaSalva(): Tema | null {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return salvo === 'claro' || salvo === 'noite' ? salvo : null
  } catch {
    return null
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Padrão do projeto: tema noite. O claro é opcional e fica salvo no localStorage.
  const [tema, setTema] = useState<Tema>(() => lerEscolhaSalva() ?? 'noite')

  // A classe .dark no <html> troca todas as cores de uma vez (tokens do index.css)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'noite')
  }, [tema])

  const alternarTema = () => {
    const proximo: Tema = tema === 'noite' ? 'claro' : 'noite'
    setTema(proximo)
    try {
      localStorage.setItem(CHAVE, proximo)
    } catch {
      // navegação privada: a escolha só não fica salva
    }
  }

  return <ThemeContext.Provider value={{ tema, alternarTema }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTema(): ThemeContextValor {
  const contexto = useContext(ThemeContext)
  if (!contexto) throw new Error('useTema precisa estar dentro de <ThemeProvider>')
  return contexto
}
