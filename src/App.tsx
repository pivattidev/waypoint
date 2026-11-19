import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Contato from './pages/Contato'
import Faq from './pages/Faq'
import Home from './pages/Home'
import Integrantes from './pages/Integrantes'
import NaoEncontrada from './pages/NaoEncontrada'
import Relatos from './pages/Relatos'
import Sobre from './pages/Sobre'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Institucionais */}
        <Route index element={<Home />} />
        <Route path="sobre" element={<Sobre />} />
        <Route path="integrantes" element={<Integrantes />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contato" element={<Contato />} />

        {/* Solução */}
        <Route path="relatos" element={<Relatos />} />

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
