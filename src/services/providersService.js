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
