import api from './api'

export const getLotes = async () => {
  const response = await api.get('/lotes')
  return response.data
}

export const registrarLote = async (lote) => {
  const response = await api.post('/lotes', lote)
  return response.data
}