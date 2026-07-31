import { useEffect, useState } from 'react'
import { getVendas, registrarVenda } from '../services/vendaService'
import { getProdutos } from '../services/produtoService'
import { Plus } from 'lucide-react'
import './Ingredientes.css'
import Loading from '../components/Loading'


const formVazio = { produtoId: '', quantidade: '', precoUnitario: '', observacao: '' }

export default function Vendas() {
  const [vendas, setVendas]           = useState([])
  const [produtos, setProdutos]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm]               = useState(formVazio)

  const carregar = async () => {
    try {
      const [v, p] = await Promise.all([getVendas(), getProdutos()])
      setVendas(v)
      setProdutos(p)
    } catch {
      alert('Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  // Quando selecionar produto, preenche preço automaticamente
  const selecionarProduto = (id) => {
    const produto = produtos.find(p => p.id === parseInt(id))
    setForm({
      ...form,
      produtoId: id,
      precoUnitario: produto ? produto.precoVenda : ''
    })
  }

  const salvar = async () => {
    try {
      await registrarVenda({
        produtoId: parseInt(form.produtoId),
        quantidade: parseInt(form.quantidade),
        precoUnitario: parseFloat(form.precoUnitario),
        observacao: form.observacao
      })
      setModalAberto(false)
      setForm(formVazio)
      carregar()
    } catch (e) {
      alert(e.response?.data?.detail || 'Erro ao registrar venda.')
    }
  }

  if (loading) return <Loading />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Vendas</h1>
          <p className="page-subtitulo">Registre suas vendas</p>
        </div>
        <button className="btn-primario" onClick={() => { setForm(formVazio); setModalAberto(true) }}>
          <Plus size={16} /> Registrar Venda
        </button>
      </div>

      <div className="tabela-wrapper">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unit.</th>
              <th>Receita Bruta</th>
              <th>Lucro</th>
              <th>Data</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map(v => (
              <tr key={v.id}>
                <td>{v.produto.nome}</td>
                <td>{v.quantidade} un</td>
                <td>R$ {v.precoUnitario.toFixed(2)}</td>
                <td>R$ {v.receitaBruta.toFixed(2)}</td>
                <td>
                  <span className={`badge ${v.lucroTotal > 0 ? 'badge-ok' : 'badge-alerta'}`}>
                    R$ {v.lucroTotal.toFixed(2)}
                  </span>
                </td>
                <td>{new Date(v.dataVenda).toLocaleDateString('pt-BR')}</td>
                <td>{v.observacao || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">Registrar Venda</h2>
            <div className="modal-form">
              <label>Produto</label>
              <select value={form.produtoId} onChange={e => selecionarProduto(e.target.value)}>
                <option value="">Selecione um produto</option>
                {produtos.filter(p => p.quantidadeEmEstoque > 0).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} (estoque: {p.quantidadeEmEstoque})
                  </option>
                ))}
              </select>

              <label>Quantidade</label>
              <input
                type="number"
                value={form.quantidade}
                onChange={e => setForm({...form, quantidade: e.target.value})}
              />

              <label>Preço Unitário (R$)</label>
              <input
                type="number"
                value={form.precoUnitario}
                onChange={e => setForm({...form, precoUnitario: e.target.value})}
              />

              <label>Observação (opcional)</label>
              <input
                value={form.observacao}
                onChange={e => setForm({...form, observacao: e.target.value})}
              />
            </div>
            <div className="modal-acoes">
              <button className="btn-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn-primario" onClick={salvar}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}