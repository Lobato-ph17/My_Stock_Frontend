import api from './api'

export const getProdutos = async () => {
  const response = await api.get('/produtos')
  return response.data
}

export const criarProduto = async (produto) => {
  const response = await api.post('/produtos', produto)
  return response.data
}

export const atualizarProduto = async (id, produto) => {
  const response = await api.put(`/produtos/${id}`, produto)
  return response.data
}

export const deletarProduto = async (id) => {
  await api.delete(`/produtos/${id}`)
}