import { useEffect, useState } from 'react'
import {
  getIngredientes, criarIngrediente,
  atualizarIngrediente, deletarIngrediente, ajustarEstoque
} from '../services/ingredienteService'
import { Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import './Ingredientes.css'
import Loading from '../components/Loading'
import EstadoVazio from '../components/EstadoVazio'

const UNIDADES = ['GRAMA', 'MILILITRO', 'UNIDADE']

const formVazio = {
  nome: '', unidade: 'GRAMA',
  quantidade: '', custoPorUnidade: '', estoqueMinimo: ''
}

export default function Ingredientes() {
  const [ingredientes, setIngredientes] = useState([])
  const [loading, setLoading]           = useState(true)
  const [erro, setErro]                 = useState(null)
  const [modalAberto, setModalAberto]   = useState(false)
  const [ajusteAberto, setAjusteAberto] = useState(false)
  const [editando, setEditando]         = useState(null)
  const [form, setForm]                 = useState(formVazio)
  const [ajusteId, setAjusteId]         = useState(null)
  const [ajusteQtd, setAjusteQtd]       = useState('')

  const carregar = async () => {
    try {
      const data = await getIngredientes()
      setIngredientes(data)
    } catch {
      setErro('Erro ao carregar ingredientes.')
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

  const abrirEditar = (ing) => {
    setEditando(ing)
    setForm({
      nome: ing.nome,
      unidade: ing.unidade,
      quantidade: ing.quantidade,
      custoPorUnidade: ing.custoPorUnidade,
      estoqueMinimo: ing.estoqueMinimo
    })
    setModalAberto(true)
  }

  const abrirAjuste = (id) => {
    setAjusteId(id)
    setAjusteQtd('')
    setAjusteAberto(true)
  }

  const salvar = async () => {
    try {
      if (editando) {
        await atualizarIngrediente(editando.id, form)
      } else {
        await criarIngrediente(form)
      }
      setModalAberto(false)
      carregar()
    } catch {
      alert('Erro ao salvar ingrediente.')
    }
  }

  const deletar = async (id) => {
    if (!confirm('Deseja deletar este ingrediente?')) return
    try {
      await deletarIngrediente(id)
      carregar()
    } catch {
      alert('Erro ao deletar.')
    }
  }

  const confirmarAjuste = async () => {
    try {
      await ajustarEstoque(ajusteId, parseFloat(ajusteQtd))
      setAjusteAberto(false)
      carregar()
    } catch {
      alert('Erro ao ajustar estoque.')
    }
  }

  if (loading) return <Loading />
  if (erro)    return <div className="page-erro">{erro}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Ingredientes</h1>
          <p className="page-subtitulo">Gerencie seu estoque de insumos</p>
        </div>
        <button className="btn-primario" onClick={abrirCriar}>
          <Plus size={16} /> Novo Ingrediente
        </button>
      </div>

      <div className="tabela-wrapper">
        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Unidade</th>
              <th>Estoque</th>
              <th>Mínimo</th>
              <th>Custo/Un</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <EstadoVazio
                  tipo="ingredientes"
                  onAcao={abrirCriar}
                  labelAcao="+ Novo Ingrediente"
                />
              </td>
            </tr>
            ) : ingredientes.map(ing => {
              const abaixo = ing.quantidade < ing.estoqueMinimo
              return (
                <tr key={ing.id}>
                  <td>{ing.nome}</td>
                  <td>{ing.unidade}</td>
                  <td>{ing.quantidade}</td>
                  <td>{ing.estoqueMinimo}</td>
                  <td>R$ {ing.custoPorUnidade.toFixed(3)}</td>
                  <td>
                    <span className={`badge ${abaixo ? 'badge-alerta' : 'badge-ok'}`}>
                      {abaixo ? 'Abaixo do mínimo' : 'OK'}
                    </span>
                  </td>
                  <td className="acoes">
                    <button className="btn-icone" onClick={() => abrirAjuste(ing.id)} title="Ajustar estoque">
                      <ArrowUpDown size={15} />
                    </button>
                    <button className="btn-icone" onClick={() => abrirEditar(ing)} title="Editar">
                      <Pencil size={15} />
                    </button>
                    <button className="btn-icone btn-icone--danger" onClick={() => deletar(ing.id)} title="Deletar">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal criar/editar */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">
              {editando ? 'Editar Ingrediente' : 'Novo Ingrediente'}
            </h2>
            <div className="modal-form">
              <label>Nome</label>
              <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />

              <label>Unidade</label>
              <select value={form.unidade} onChange={e => setForm({...form, unidade: e.target.value})}>
                {UNIDADES.map(u => <option key={u}>{u}</option>)}
              </select>

              <label>Quantidade inicial</label>
              <input type="number" value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} />

              <label>Custo por unidade (R$)</label>
              <input type="number" value={form.custoPorUnidade} onChange={e => setForm({...form, custoPorUnidade: e.target.value})} />

              <label>Estoque mínimo</label>
              <input type="number" value={form.estoqueMinimo} onChange={e => setForm({...form, estoqueMinimo: e.target.value})} />
            </div>
            <div className="modal-acoes">
              <button className="btn-secundario" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className="btn-primario" onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ajuste de estoque */}
      {ajusteAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">Ajustar Estoque</h2>
            <p className="modal-desc">Use valor positivo para adicionar e negativo para remover.</p>
            <div className="modal-form">
              <label>Quantidade</label>
              <input type="number" value={ajusteQtd} onChange={e => setAjusteQtd(e.target.value)} />
            </div>
            <div className="modal-acoes">
              <button className="btn-secundario" onClick={() => setAjusteAberto(false)}>Cancelar</button>
              <button className="btn-primario" onClick={confirmarAjuste}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}