import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Contato from './pages/Contato'
import Faq from './pages/Faq'
import Home from './pages/Home'
import Integrantes from './pages/Integrantes'
import NaoEncontrada from './pages/NaoEncontrada'
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

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
