// src/services/categoriasService.js
import api from './axiosConfig';

// Obtener todas las categorías
export const getCategorias = async () => {
  try {
    const response = await api.get('/categorias');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

// Obtener una categoría por ID
export const getCategoriaById = async (id) => {
  try {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener categoría con ID ${id}:`, error);
    throw error;
  }
};

export const cambiarEstadoCategoria = async (id) => {
  try{
      const response = await api.patch(`/categorias/${id}`);
      return response.data;
  } catch (error) {
      console.error(`Error al eliminar categoria con id ${id}:`, error);
      throw error;
  }
}

// Crear una nueva categoría
export const createCategoria = async (categoriaData) => {
  try {
    const response = await api.post('/categorias', categoriaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

// Actualizar una categoría existente
export const updateCategoria = async (id, categoriaData) => {
  try {
    const response = await api.put(`/categorias/${id}`, categoriaData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar categoría con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar una categoría
export const deleteCategoria = async (id) => {
  try {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar categoría con ID ${id}:`, error);
    throw error;
  }
};

export default {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
};