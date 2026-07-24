import api from './api'

export const getVendas = async () => {
  const response = await api.get('/vendas')
  return response.data
}

export const registrarVenda = async (venda) => {
  const response = await api.post('/vendas', venda)
  return response.data
}