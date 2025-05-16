import api from './axiosConfig';

export const getSales = async () => {
  const response = await api.get('/ventas');
  return response.data;
};

export const createSale = async (userData) => {
  const response = await api.post('/ventas', userData);
  return response.data;
};

export const updateSale = async (id, userData) => {
    const response = await api.put(`/ventas`, userData);
    return response.data;
    
};

export const deleteSale = async (id) => {
  const response = await api.delete(`/ventas/${id}`);
  return response.data;
};

export const cambiarEstadoVenta = async (id) => {
  try{
      const response = await api.patch(`/ventas/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error al cambiar estado de la venta con id ${id}:`, error);
      throw error;
  }
}
