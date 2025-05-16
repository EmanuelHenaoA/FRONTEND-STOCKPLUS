import api from './axiosConfig';

export const getRepuestos = async () => {
  const response = await api.get('/repuestos');
  return response.data;
};

export const getRepuestosActivos = async () => {
  const response = await api.get(`/repuestos/activos`);
  return response.data;
};

export const getRepuestosCategoria = async (categoriaId) => {
  const response = await api.get(`/repuestos/activos/${categoriaId}`);
  return response.data;
};

// En repuestosService.js

// Crear un nuevo repuesto
export const createRepuesto = async (repuestoData) => {
  try {
    console.log('Enviando datos al servidor:', repuestoData);
    const response = await api.post('/repuestos', repuestoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear repuesto:', error);
    console.error('Detalles del error:', error.response?.data);
    throw error;
  }
};

export const updateRepuesto = async (id, repuestoData) => {
  try {
      console.log('Enviando datos de actualización al servidor:', { id, repuestoData });
      const response = await api.put(`/repuestos/${id}`, repuestoData);
      return response.data;
  } catch (error) {
      console.error('Error al actualizar repuesto:', error);
      console.error('Detalles del error:', error.response?.data);
      throw error;
  }
};

export const deleteRepuesto = async (id) => {
  const response = await api.delete(`/repuestos/${id}`);
  return response.data;
};

export const cambiarEstadoRepuesto = async (id) => {
  try{
      const response = await api.patch(`/repuestos/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error al eliminar repuesto con id ${id}:`, error);
      throw error;
  }
}