// src/services/marcasService.js
import api from './axiosConfig';

// Obtener todas las marcas
export const getMarcas = async () => {
  try {
    const response = await api.get('/marcas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    throw error;
  }
};

// Obtener una marca por ID
export const getMarcaById = async (id) => {
  try {
    const response = await api.get(`/marcas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener marca con ID ${id}:`, error);
    throw error;
  }
};

export const cambiarEstadoMarca = async (id) => {
  try{
      const response = await api.patch(`/marcas/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error al eliminar categoria con id ${id}:`, error);
      throw error;
  }
}


// Crear una nueva marca
export const createMarca = async (marcaData) => {
  try {
    const response = await api.post('/marcas', marcaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear marca:', error);
    throw error;
  }
};

// Actualizar una marca existente
export const updateMarca = async (id, marcaData) => {
  try {
    const response = await api.put(`/marcas/${id}`, marcaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar marca con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una marca
export const deleteMarca = async (id) => {
  try {
    const response = await api.delete(`/marcas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar marca con ID ${id}:`, error);
    throw error;
  }
};

export default {
  getMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca
};