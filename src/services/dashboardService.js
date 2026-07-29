import api from './api'

export const getDashboard = async () => {
  const [dashboard, produtos,  alertas] = await Promise.all([
    api.get('/dashboard'),
    api.get('/produtos'),
    api.get('/ingredientes/alertas')
  ])

  const totalEmEstoque = produtos.data.reduce(
    (acc, p) => acc + p.quantidadeEmEstoque, 0
  )

  return {
    ...dashboard.data,
    totalEmEstoque
  }
}