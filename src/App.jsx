import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Ingredientes from './pages/Ingredientes'
import Produtos from './pages/Produtos'
import Receitas from './pages/Receitas'
import Producao from './pages/Producao'
import Vendas from './pages/Vendas'
import Despesas from './pages/Despesas'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="ingredientes" element={<Ingredientes />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="receitas" element={<Receitas />} />
        <Route path="producao" element={<Producao />} />
        <Route path="vendas" element={<Vendas />} />      
        <Route path="despesas" element={<Despesas />} />  
      </Route>
    </Routes>
  )
}