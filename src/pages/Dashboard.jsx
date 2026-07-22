import { useEffect, useState } from 'react'
import { getDashboard } from '../services/dashboardService'
import {
  TrendingUp, DollarSign, ShoppingCart,
  AlertTriangle, Package, Factory
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import './Dashboard.css'

export default function Dashboard() {
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    getDashboard()
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar o dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="dashboard-loading">Carregando...</div>
  if (erro)    return <div className="dashboard-erro">{erro}</div>

  const cards = [
    {
      label: 'Faturamento Bruto',
      value: `R$ ${dados.faturamentoBruto.toFixed(2)}`,
      icon: DollarSign,
      cor: '#4CAF50'
    },
    {
      label: 'Lucro Líquido',
      value: `R$ ${dados.lucroLiquido.toFixed(2)}`,
      icon: TrendingUp,
      cor: '#2196F3'
    },
    {
      label: 'Total de Vendas',
      value: dados.totalVendas,
      icon: ShoppingCart,
      cor: '#9C27B0'
    },
    {
      label: 'Lotes Produzidos',
      value: dados.totalLotes,
      icon: Factory,
      cor: '#FF9800'
    },
    {
      label: 'Ingredientes em Alerta',
      value: dados.ingredientesAbaixoDoMinimo,
      icon: AlertTriangle,
      cor: '#f44336'
    },
    {
      label: 'Produtos Sem Estoque',
      value: dados.produtosSemEstoque,
      icon: Package,
      cor: '#607D8B'
    },
  ]

  return (
    <div className="dashboard">
      <h1 className="dashboard-titulo">Dashboard</h1>
      <p className="dashboard-subtitulo">Resumo do mês atual</p>

      <div className="cards-grid">
        {cards.map(({ label, value, icon: Icon, cor }) => (
          <div key={label} className="card">
            <div className="card-icon" style={{ background: cor + '20', color: cor }}>
              <Icon size={22} />
            </div>
            <div className="card-info">
              <span className="card-label">{label}</span>
              <span className="card-value">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {dados.rankingProdutos?.length > 0 && (
        <div className="grafico-section">
          <h2 className="grafico-titulo">Produtos Mais Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.rankingProdutos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalVendido" fill="#e94560" name="Qtd Vendida" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}