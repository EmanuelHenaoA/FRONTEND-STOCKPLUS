import api from './axiosConfig';

export const getBuys = async () => {
  const response = await api.get('/compras');
  return response.data;
};

export const createBuy = async (userData) => {
  const response = await api.post('/compras', userData);
  return response.data;
};

export const updateBuy = async (id, userData) => {
    const response = await api.put(`/compras`, userData);
    return response.data;
    
};

export const deleteBuy = async (id) => {
  const response = await api.delete(`/compras/${id}`);
  return response.data;
};

export const cambiarEstadoCompra = async (id) => {
  try{
      const response = await api.patch(`/compras/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error al cambiar estado de la compra con id ${id}:`, error);
      throw error;
  }
}
