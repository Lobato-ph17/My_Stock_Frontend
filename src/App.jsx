import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Ingredientes from './pages/Ingredientes'
import Produtos from './pages/Produtos'
import Receitas from './pages/Receitas'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="ingredientes" element={<Ingredientes />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="receitas" element={<Receitas />} />
      </Route>
    </Routes>
  )
}