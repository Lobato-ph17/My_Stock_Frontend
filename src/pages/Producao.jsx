import { useEffect, useState } from 'react'
import { getLotes, registrarLote } from '../services/loteService'
import { getProdutos } from '../services/produtoService'
import { Plus, Factory } from 'lucide-react'
import './Ingredientes.css'
import Loading from '../components/Loading'

const formVazio = { produtoId: '', quantidade: '', observacao: '' }

export default function Producao() {
  const [lotes, setLotes]           = useState([])
  const [produtos, setProdutos]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm]             = useState(formVazio)

  const carregar = async () => {
    try {
      const [l, p] = await Promise.all([getLotes(), getProdutos()])
      setLotes(l)
      setProdutos(p)
    } catch {
      alert('Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  const salvar = async () => {
    try {
      await registrarLote({
        produtoId: parseInt(form.produtoId),
        quantidade: parseInt(form.quantidade),
        observacao: form.observacao
      })
      setModalAberto(false)
      setForm(formVazio)
      carregar()
    } catch (e) {
      alert(e.response?.data?.detail || 'Erro ao registrar lote.')
    }
  }

  if (loading) return <Loading />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Produção</h1>
          <p className="page-subtitulo">Registre seus lotes de produção</p>
        </div>
        <button className="btn-primario" onClick={() => { setForm(formVazio); setModalAberto(true) }}>
          <Plus size={16} /> Registrar Lote
        </button>
      </div>

      <div className="tabela-wrapper">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Custo Total</th>
              <th>Data</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {lotes.map(l => (
              <tr key={l.id}>
                <td>{l.produto.nome}</td>
                <td>{l.quantidade} un</td>
                <td>R$ {l.custoTotalLote.toFixed(2)}</td>
                <td>{new Date(l.dataProducao).toLocaleDateString('pt-BR')}</td>
                <td>{l.observacao || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">Registrar Lote de Produção</h2>
            <div className="modal-form">
              <label>Produto</label>
              <select value={form.produtoId} onChange={e => setForm({...form, produtoId: e.target.value})}>
                <option value="">Selecione um produto</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} (estoque: {p.quantidadeEmEstoque})
                  </option>
                ))}
              </select>

              <label>Quantidade a produzir</label>
              <input
                type="number"
                value={form.quantidade}
                onChange={e => setForm({...form, quantidade: e.target.value})}
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