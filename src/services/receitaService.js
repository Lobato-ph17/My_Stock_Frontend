import api from './api'

export const getReceitas = async () => {
  const response = await api.get('/receitas')
  return response.data
}

export const getReceitaPorProduto = async (produtoId) => {
  const response = await api.get(`/receitas/produto/${produtoId}`)
  return response.data
}

export const salvarReceita = async (receita) => {
  const response = await api.post('/receitas', receita)
  return response.data
}

export const deletarReceita = async (produtoId) => {
  await api.delete(`/receitas/produto/${produtoId}`)
}