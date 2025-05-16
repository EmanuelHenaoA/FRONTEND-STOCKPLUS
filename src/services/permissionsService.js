import api from "./axiosConfig";


export const getPermisos = async () => {
    try {
        const response = await api.get(`/permisos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        throw error;
    }
};

export const obtenerPermisoPorId = async (id) => {
    try {
        const response = await api.get(`/permisos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener permiso con id ${id}:`, error);
        throw error;
    }
};

export const createPermiso = async (permiso) => {
    try {
        const response = await api.post(`/permisos`, permiso);
        return response.data;
    } catch (error) {
        console.error('Error al crear permiso:', error);
        throw error;
    }
};

export const updatePermiso = async (id, permiso) => {
    try {
        const response = await api.put(`/permisos/${id}`, permiso);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar permiso con id ${id}:`, error);
        throw error;
    }
};

export const deletePermiso = async (id) => {
    try {
        const response = await api.delete(`/permisos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar permiso con id ${id}:`, error);
        throw error;
    }
};