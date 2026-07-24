import { useEffect, useState } from 'react'
import { getProdutos, criarProduto, atualizarProduto, deletarProduto } from '../services/produtoService'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import './Ingredientes.css'

const formVazio = { nome: '', descricao: '', precoVenda: '' }

export default function Produtos() {
  const [produtos, setProdutos]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [erro, setErro]               = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando]       = useState(null)
  const [form, setForm]               = useState(formVazio)

  const carregar = async () => {
    try {
      const data = await getProdutos()
      setProdutos(data)
    } catch {
      setErro('Erro ao carregar produtos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  const abrirCriar = () => {
    setEditando(null)
    setForm(formVazio)
    setModalAberto(true)
  }

  const abrirEditar = (p) => {
    setEditando(p)
    setForm({ nome: p.nome, descricao: p.descricao || '', precoVenda: p.precoVenda })
    setModalAberto(true)
  }

  const salvar = async () => {
    try {
      if (editando) {
        await atualizarProduto(editando.id, form)
      } else {
        await criarProduto(form)
      }
      setModalAberto(false)
      carregar()
    } catch {
      alert('Erro ao salvar produto.')
    }
  }

  const deletar = async (id) => {
    if (!confirm('Deseja deletar este produto?')) return
    try {
      await deletarProduto(id)
      carregar()
    } catch {
      alert('Erro ao deletar.')
    }
  }

  if (loading) return <div className="page-loading">Carregando...</div>
  if (erro)    return <div className="page-erro">{erro}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Produtos</h1>
          <p className="page-subtitulo">Gerencie seus doces</p>
        </div>
        <button className="btn-primario" onClick={abrirCriar}>
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      <div className="tabela-wrapper">
        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço Venda</th>
              <th>Custo Produção</th>
              <th>Margem</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(p => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.descricao || '—'}</td>
                <td>R$ {p.precoVenda.toFixed(2)}</td>
                <td>R$ {p.custoProducao.toFixed(2)}</td>
                <td>
                  <span className={`badge ${p.margemLucro > 0 ? 'badge-ok' : 'badge-alerta'}`}>
                    {p.margemLucro.toFixed(1)}%
                  </span>
                </td>
                <td>{p.quantidadeEmEstoque}</td>
                <td className="acoes">
                  <button className="btn-icone" onClick={() => abrirEditar(p)} title="Editar">
                    <Pencil size={15} />
                  </button>
                  <button className="btn-icone btn-icone--danger" onClick={() => deletar(p.id)} title="Deletar">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">
              {editando ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <div className="modal-form">
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />

              <label>Descrição (opcional)</label>
              <input value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />

              <label>Preço de Venda (R$)</label>
              <input type="number" value={form.precoVenda} onChange={e => setForm({...form, precoVenda: e.target.value})} />
            </div>
            <div className="modal-acoes">
              <button className="btn-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn-primario" onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}