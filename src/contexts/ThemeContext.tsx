import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Tema = 'noite' | 'claro'

interface ThemeContextValor {
  tema: Tema
  alternarTema: () => void
}

const ThemeContext = createContext<ThemeContextValor | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Padrão do projeto: tema noite.
  const [tema, setTema] = useState<Tema>('noite')

  // A classe .dark no <html> troca todas as cores de uma vez (tokens do index.css)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'noite')
  }, [tema])

  const alternarTema = () => {
    const proximo: Tema = tema === 'noite' ? 'claro' : 'noite'
    setTema(proximo)
  }

  return <ThemeContext.Provider value={{ tema, alternarTema }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTema(): ThemeContextValor {
  const contexto = useContext(ThemeContext)
  if (!contexto) throw new Error('useTema precisa estar dentro de <ThemeProvider>')
  return contexto
}
