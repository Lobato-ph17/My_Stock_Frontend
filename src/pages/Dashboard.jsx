import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard } from '../services/dashboardService'
import { DollarSign, Package, AlertTriangle } from 'lucide-react'
import './Dashboard.css'
import Loading from '../components/Loading'

const mes = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date())

export default function Dashboard() {
  const [dados, setDados]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro]       = useState(null)
  const navigate              = useNavigate()

  useEffect(() => {
    getDashboard()
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar o dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (erro)    return <div className="dashboard-erro">{erro}</div>

  const alertas = dados.ingredientesAbaixoDoMinimo + dados.produtosSemEstoque

  return (
    <div className="dashboard">

      <svg className="dashboard-bg" viewBox="0 0 300 300" fill="none">
        <circle cx="80" cy="80" r="50" stroke="#2C1A0E" strokeWidth="2"/>
        <circle cx="80" cy="80" r="35" stroke="#2C1A0E" strokeWidth="1.5"/>
        <circle cx="80" cy="80" r="12" fill="#2C1A0E"/>
        <path d="M55 80 Q65 60 80 65 Q95 70 105 80" stroke="#2C1A0E" strokeWidth="1.5" fill="none"/>
        <rect x="160" y="40" width="80" height="60" rx="8" stroke="#2C1A0E" strokeWidth="2"/>
        <path d="M160 60 h80" stroke="#2C1A0E" strokeWidth="1.5"/>
        <circle cx="180" cy="50" r="4" fill="#2C1A0E"/>
        <circle cx="200" cy="50" r="4" fill="#2C1A0E"/>
        <path d="M170 75 h60 M170 85 h40" stroke="#2C1A0E" strokeWidth="1.5"/>
        <path d="M60 170 Q80 140 100 160 Q120 180 140 150 Q160 120 180 145" stroke="#2C1A0E" strokeWidth="2" fill="none"/>
        <circle cx="60" cy="170" r="5" fill="#2C1A0E"/>
        <circle cx="100" cy="160" r="5" fill="#2C1A0E"/>
        <circle cx="140" cy="150" r="5" fill="#2C1A0E"/>
        <circle cx="180" cy="145" r="5" fill="#2C1A0E"/>
        <ellipse cx="220" cy="200" rx="40" ry="20" stroke="#2C1A0E" strokeWidth="2"/>
        <ellipse cx="220" cy="190" rx="30" ry="14" stroke="#2C1A0E" strokeWidth="1.5"/>
        <path d="M195 195 Q220 175 245 195" stroke="#2C1A0E" strokeWidth="1.5" fill="none"/>
        <circle cx="100" cy="240" r="30" stroke="#2C1A0E" strokeWidth="2"/>
        <path d="M80 240 Q90 220 100 230 Q110 240 120 225 Q130 210 140 240" stroke="#2C1A0E" strokeWidth="1.5" fill="none"/>
      </svg>

      <div className="dashboard-header">
        <div className="dashboard-mes">{mes}</div>
        <h1 className="dashboard-titulo">Visão geral</h1>
      </div>

      {/* Hero */}
      <div className="hero-card">
        <div className="hero-principal">
          <div className="hero-label">Faturamento do mês</div>
          <div className="hero-valor">
            R$ {dados.faturamentoBruto.toFixed(2).replace('.', ',')}
          </div>
          <div className="hero-lucro">
            Lucro líquido: R$ {dados.lucroLiquido.toFixed(2).replace('.', ',')}
          </div>
        </div>
        <div className="hero-divider" />
        <div className="hero-stat">
          <div className="hero-stat-val">{dados.totalVendas}</div>
          <div className="hero-stat-label">Vendas</div>
        </div>
        <div className="hero-divider" />
        <div className="hero-stat">
          <div className="hero-stat-val">{dados.totalLotes}</div>
          <div className="hero-stat-label">Lotes</div>
        </div>
        <div className="hero-divider" />
        <div className="hero-stat">
          <div className="hero-stat-val">{dados.totalDocesEmEstoque}</div>
          <div className="hero-stat-label">Em estoque</div>
        </div>
      </div>

      {/* Cards secundários */}
      <div className="cards-grid">
        <div className="card">
          <div className="card-icone card-icone--laranja">
            <DollarSign size={17} />
          </div>
          <div className="card-valor">
            R$ {dados.totalCustoProducao.toFixed(2).replace('.', ',')}
          </div>
          <div className="card-label">Custo de produção</div>
        </div>
        <div className="card">
          <div className="card-icone card-icone--verde">
            <Package size={17} />
          </div>
          <div className="card-valor">
            R$ {dados.totalDespesas.toFixed(2).replace('.', ',')}
          </div>
          <div className="card-label">Total de despesas</div>
        </div>
        <div className="card">
          <div className="card-icone card-icone--verm">
            <AlertTriangle size={17} />
          </div>
          <div className="card-valor">{alertas}</div>
          <div className="card-label">Alertas ativos</div>
        </div>
      </div>

      {/* Painel inferior */}
      <div className="dashboard-bottom">

        {/* Mais vendidos */}
        <div className="dash-panel">
          <h2 className="dash-panel-titulo">Mais vendidos</h2>
          {dados.rankingProdutos?.length === 0 ? (
            <p style={{ color: '#A0856E', fontSize: '13px' }}>Nenhuma venda ainda.</p>
          ) : (
            dados.rankingProdutos?.map((p, i) => (
              <div key={p.produtoId} className="ranking-item">
                <div className="ranking-pos">{i + 1}</div>
                <span className="ranking-nome">{p.nome}</span>
                <span className="ranking-faturamento">
                  R$ {Number(p.faturamento).toFixed(2).replace('.', ',')}
                </span>
                <span className="ranking-qtd">{p.totalVendido} un</span>
              </div>
            ))
          )}
        </div>

        {/* Alertas */}
        <div className="dash-panel">
          <h2 className="dash-panel-titulo">Alertas de estoque</h2>
          {alertas === 0 ? (
            <div className="alerta-item alerta-item--ok">
              Tudo em ordem — nenhum alerta no momento.
            </div>
          ) : (
            <>
              {dados.nomesIngredientesAlerta?.map(nome => (
                <div
                  key={nome}
                  className="alerta-item alerta-item--warn alerta-item--clicavel"
                  onClick={() => navigate('/ingredientes')}
                >
                  <AlertTriangle size={14} />
                  <span><strong>{nome}</strong> abaixo do mínimo</span>
                  <span className="alerta-arrow">→</span>
                </div>
              ))}
              {dados.produtosSemEstoque > 0 && (
                <div
                  className="alerta-item alerta-item--verm alerta-item--clicavel"
                  onClick={() => navigate('/produtos')}
                >
                  <Package size={14} />
                  <span><strong>{dados.produtosSemEstoque} produto(s)</strong> sem estoque</span>
                  <span className="alerta-arrow">→</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}