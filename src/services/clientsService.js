import api from './axiosConfig';

export const getClient = async () => {
  const response = await api.get('/clientes');
  return response.data;
};

export const createClient = async (userData) => {
  const response = await api.post('/clientes', userData);
  return response.data;
};

export const updateClient = async (id, userData) => {
    const response = await api.put(`/clientes/${id}`, userData);
    return response.data;
    
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
};
