import api from './api'

export const getIngredientes = async () => {
  const response = await api.get('/ingredientes')
  return response.data
}

export const getIngredienteAlertas = async () => {
  const response = await api.get('/ingredientes/alertas')
  return response.data
}

export const criarIngrediente = async (ingrediente) => {
  const response = await api.post('/ingredientes', ingrediente)
  return response.data
}

export const atualizarIngrediente = async (id, ingrediente) => {
  const response = await api.put(`/ingredientes/${id}`, ingrediente)
  return response.data
}

export const ajustarEstoque = async (id, quantidade) => {
  const response = await api.patch(`/ingredientes/${id}/estoque`, { quantidade })
  return response.data
}

export const deletarIngrediente = async (id) => {
  await api.delete(`/ingredientes/${id}`)
}