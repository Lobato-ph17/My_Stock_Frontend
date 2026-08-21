import api from './api'

export const getDespesas = async () => {
  const response = await api.get('/despesas')
  return response.data
}

export const criarDespesa = async (despesa) => {
  const response = await api.post('/despesas', despesa)
  return response.data
}

export const atualizarDespesa = async (id, despesa) => {
  const response = await api.put(`/despesas/${id}`, despesa)
  return response.data
}

export const deletarDespesa = async (id) => {
  await api.delete(`/despesas/${id}`)
}