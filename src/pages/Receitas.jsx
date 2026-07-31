import { useEffect, useState } from 'react'
import { getReceitas, salvarReceita, deletarReceita } from '../services/receitaService'
import { getProdutos } from '../services/produtoService'
import { getIngredientes } from '../services/ingredienteService'
import { Plus, Trash2, ChefHat } from 'lucide-react'
import './Ingredientes.css'


export default function Receitas() {
  const [receitas, setReceitas]       = useState([])
  const [produtos, setProdutos]       = useState([])
  const [ingredientes, setIngredientes] = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [produtoId, setProdutoId]     = useState('')
  const [itens, setItens]             = useState([{ ingredienteId: '', quantidade: '' }])

  const carregar = async () => {
    try {
      const [r, p, i] = await Promise.all([getReceitas(), getProdutos(), getIngredientes()])
      setReceitas(r)
      setProdutos(p)
      setIngredientes(i)
    } catch {
      alert('Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  const abrirModal = () => {
    setProdutoId('')
    setItens([{ ingredienteId: '', quantidade: '' }])
    setModalAberto(true)
  }

  const adicionarItem = () => {
    setItens([...itens, { ingredienteId: '', quantidade: '' }])
  }

  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...itens]
    novosItens[index][campo] = valor
    setItens(novosItens)
  }

  const salvar = async () => {
    try {
      await salvarReceita({
        produtoId: parseInt(produtoId),
        itens: itens.map(i => ({
          ingredienteId: parseInt(i.ingredienteId),
          quantidade: parseFloat(i.quantidade)
        }))
      })
      setModalAberto(false)
      carregar()
    } catch {
      alert('Erro ao salvar receita.')
    }
  }

  const deletar = async (produtoId) => {
    if (!confirm('Deseja deletar esta receita?')) return
    try {
      await deletarReceita(produtoId)
      carregar()
    } catch {
      alert('Erro ao deletar.')
    }
  }

  if (loading) return <div className="page-loading">Carregando...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Receitas</h1>
          <p className="page-subtitulo">Defina os ingredientes de cada doce</p>
        </div>
        <button className="btn-primario" onClick={abrirModal}>
          <Plus size={16} /> Nova Receita
        </button>
      </div>

      <div className="receitas-grid">
        {receitas.map(r => (
          <div key={r.id} className="receita-card">
            <div className="receita-card-header">
              <div className="receita-icon"><ChefHat size={20} /></div>
              <div>
                <h3 className="receita-nome">{r.produto.nome}</h3>
                <p className="receita-custo">Custo total: R$ {r.custoTotal.toFixed(3)}</p>
              </div>
              <button className="btn-icone btn-icone--danger" onClick={() => deletar(r.produto.id)}>
                <Trash2 size={15} />
              </button>
            </div>
            <table className="tabela receita-tabela">
              <thead>
                <tr>
                  <th>Ingrediente</th>
                  <th>Quantidade</th>
                  <th>Custo</th>
                </tr>
              </thead>
              <tbody>
                {r.itens.map(item => (
                  <tr key={item.id}>
                    <td>{item.ingrediente.nome}</td>
                    <td>{item.quantidade} {item.ingrediente.unidade}</td>
                    <td>R$ {item.custoItem.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal modal--largo">
            <h2 className="modal-titulo">Nova Receita</h2>
            <div className="modal-form">
              <label>Produto</label>
              <select value={produtoId} onChange={e => setProdutoId(e.target.value)}>
                <option value="">Selecione um produto</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div className="receita-itens">
              <div className="receita-itens-header">
                <span className="receita-itens-titulo">Ingredientes</span>
                <button className="btn-primario" onClick={adicionarItem}>
                  <Plus size={14} /> Adicionar
                </button>
              </div>
              {itens.map((item, index) => (
                <div key={index} className="receita-item-row">
                  <select
                    value={item.ingredienteId}
                    onChange={e => atualizarItem(index, 'ingredienteId', e.target.value)}
                  >
                    <option value="">Selecione</option>
                    {ingredientes.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.nome} ({i.unidade})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantidade"
                    value={item.quantidade}
                    onChange={e => atualizarItem(index, 'quantidade', e.target.value)}
                  />
                  {itens.length > 1 && (
                    <button className="btn-icone btn-icone--danger" onClick={() => removerItem(index)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-acoes">
              <button className="btn-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn-primario" onClick={salvar}>Salvar Receita</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}