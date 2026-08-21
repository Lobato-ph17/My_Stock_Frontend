import { useEffect, useState } from 'react'
import { getDespesas, criarDespesa, atualizarDespesa, deletarDespesa } from '../services/despesaService'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Loading from '../components/Loading'
import './Ingredientes.css'

const CATEGORIAS = ['EMBALAGEM', 'GAS', 'ENERGIA', 'TRANSPORTE', 'INGREDIENTE_AVULSO', 'OUTRO']

const CATEGORIA_LABEL = {
  EMBALAGEM: 'Embalagem',
  GAS: 'Gás',
  ENERGIA: 'Energia',
  TRANSPORTE: 'Transporte',
  INGREDIENTE_AVULSO: 'Ingrediente avulso',
  OUTRO: 'Outro'
}

const CATEGORIA_COR = {
  EMBALAGEM:         { bg: '#EDE0D0', color: '#5C3D25' },
  GAS:               { bg: '#FDE8E8', color: '#C0392B' },
  ENERGIA:           { bg: '#FDF0E3', color: '#C8854A' },
  TRANSPORTE:        { bg: '#E8F5EC', color: '#3A7D52' },
  INGREDIENTE_AVULSO:{ bg: '#EAF0FD', color: '#2C5FA8' },
  OUTRO:             { bg: '#F5EFE4', color: '#A0856E' },
}

const formVazio = { descricao: '', valor: '', categoria: 'EMBALAGEM', observacao: '' }

export default function Despesas() {
  const [despesas, setDespesas]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando]       = useState(null)
  const [form, setForm]               = useState(formVazio)

  const carregar = async () => {
    try {
      const data = await getDespesas()
      setDespesas(data)
    } catch {
      alert('Erro ao carregar despesas.')
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

  const abrirEditar = (d) => {
    setEditando(d)
    setForm({
      descricao: d.descricao,
      valor: d.valor,
      categoria: d.categoria,
      observacao: d.observacao || ''
    })
    setModalAberto(true)
  }

  const salvar = async () => {
    try {
      if (editando) {
        await atualizarDespesa(editando.id, form)
      } else {
        await criarDespesa(form)
      }
      setModalAberto(false)
      carregar()
    } catch {
      alert('Erro ao salvar despesa.')
    }
  }

  const deletar = async (id) => {
    if (!confirm('Deseja deletar esta despesa?')) return
    try {
      await deletarDespesa(id)
      carregar()
    } catch {
      alert('Erro ao deletar.')
    }
  }

  const totalMes = despesas.reduce((acc, d) => acc + d.valor, 0)

  if (loading) return <Loading />

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Despesas</h1>
          <p className="page-subtitulo">
            Total registrado: <strong style={{ color: '#C0392B' }}>
              R$ {totalMes.toFixed(2).replace('.', ',')}
            </strong>
          </p>
        </div>
        <button className="btn-primario" onClick={abrirCriar}>
          <Plus size={16} /> Nova Despesa
        </button>
      </div>

      <div className="tabela-wrapper">
        <table className="tabela">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {despesas.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: '#A0856E', padding: '32px' }}>
                  Nenhuma despesa registrada ainda.
                </td>
              </tr>
            ) : (
              despesas.map(d => {
                const cor = CATEGORIA_COR[d.categoria] || CATEGORIA_COR.OUTRO
                return (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 500 }}>{d.descricao}</td>
                    <td>
                      <span className="badge" style={{ background: cor.bg, color: cor.color }}>
                        {CATEGORIA_LABEL[d.categoria] || d.categoria}
                      </span>
                    </td>
                    <td style={{ color: '#C0392B', fontWeight: 600 }}>
                      R$ {d.valor.toFixed(2).replace('.', ',')}
                    </td>
                    <td>{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                    <td>{d.observacao || '—'}</td>
                    <td className="acoes">
                      <button className="btn-icone" onClick={() => abrirEditar(d)} title="Editar">
                        <Pencil size={15} />
                      </button>
                      <button className="btn-icone btn-icone--danger" onClick={() => deletar(d.id)} title="Deletar">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">
              {editando ? 'Editar Despesa' : 'Nova Despesa'}
            </h2>
            <div className="modal-form">
              <label>Descrição</label>
              <input
                value={form.descricao}
                onChange={e => setForm({ ...form, descricao: e.target.value })}
                placeholder="Ex: Compra de embalagens"
              />

              <label>Categoria</label>
              <select
                value={form.categoria}
                onChange={e => setForm({ ...form, categoria: e.target.value })}
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>
                ))}
              </select>

              <label>Valor (R$)</label>
              <input
                type="number"
                value={form.valor}
                onChange={e => setForm({ ...form, valor: e.target.value })}
                placeholder="0,00"
              />

              <label>Observação (opcional)</label>
              <input
                value={form.observacao}
                onChange={e => setForm({ ...form, observacao: e.target.value })}
              />
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