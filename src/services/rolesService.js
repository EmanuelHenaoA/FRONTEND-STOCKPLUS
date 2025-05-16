import api from "./axiosConfig";

export const getRoles = async () => {
  const response = await api.get('/roles'); // Ajusta la ruta según tu API
  return response.data;
};


export const getRolesActivos = async () => {
    const response = await api.get('/roles/activos'); // Ajusta la ruta según tu API
    return response.data;
  };

export const obtenerRolPorId = async (id) => {
    try {
        const response = await api.get(`$/roles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener rol con id ${id}:`, error);
        throw error;
    }
};

export const crearRol = async (rol) => {
    try {
        const response = await api.post(`/roles`, rol);
        return response.data;
    } catch (error) {
        console.error('Error al crear rol:', error);
        throw error;
    }
};

export const actualizarRol = async (id, rol) => {
    try {
        const response = await api.put(`/roles//${id}`, rol);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar rol con id ${id}:`, error);
        throw error;
    }
};

export const eliminarRol = async (id) => {
    try {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar rol con id ${id}:`, error);
        throw error;
    }
};

export const cambiarEstadoRol = async (id) => {
    try{
        const response = await api.patch(`/roles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar rol con id ${id}:`, error);
        throw error;
    }
}