import api from './axiosConfig';

export const getUsers = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/usuarios', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
    
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};

export const cambiarEstadoUsuario = async (id) => {
  try{
      const response = await api.patch(`/usuarios/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error al cambiar estado del usuario con id ${id}:`, error);
      throw error;
  }
}
