import api from './axiosConfig';

export const getProviders = async () => {
  const response = await api.get('/proveedores');
  return response.data;
};

export const createProvider = async (userData) => {
  const response = await api.post('/proveedores', userData);
  return response.data;
};

export const updateProvider = async (id, userData) => {
    const response = await api.put(`/proveedores/${id}`, userData);
    return response.data;
    
};

export const deleteProvider = async (id) => {
  const response = await api.delete(`/proveedores/${id}`);
  return response.data;
};

export const cambiarEstadoProveedor = async (id) => {
  try{
      const response = await api.patch(`/proveedores/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error al cambiar estado de proveedor con id ${id}:`, error);
      throw error;
  }
}
