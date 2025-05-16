import api from './axiosConfig';

// Servicios del dashboard
export const dashboardService = {
  // Obtener ventas semanales
  getVentasSemanales: async () => {
    try {
      const response = await api.get('/dashboard/ventas-semanales');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ventas semanales:', error);
      throw error;
    }
  },

  // Obtener top clientes
  getTopClientes: async () => {
    try {
      const response = await api.get('/dashboard/top-clientes');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo top clientes:', error);
      throw error;
    }
  },

  // Obtener repuestos más vendidos
  getRepuestosMasVendidos: async () => {
    try {
      const response = await api.get('/dashboard/repuestos-mas-vendidos');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo repuestos más vendidos:', error);
      throw error;
    }
  },

  // Obtener repuestos con mayor ingreso
  getRepuestosMayorIngreso: async () => {
    try {
      const response = await api.get('/dashboard/repuestos-mayor-ingreso');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo repuestos con mayor ingreso:', error);
      throw error;
    }
  },

  // Obtener estadísticas generales
  getEstadisticasGenerales: async () => {
    try {
      const response = await api.get('/dashboard/estadisticas-generales');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas generales:', error);
      throw error;
    }
  },

  // Obtener ventas por categoría
  getVentasPorCategoria: async () => {
    try {
      const response = await api.get('/dashboard/ventas-por-categoria');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ventas por categoría:', error);
      throw error;
    }
  },

  // Obtener ventas por mes
  getVentasPorMes: async () => {
    try {
      const response = await api.get('/dashboard/ventas-por-mes');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ventas por mes:', error);
      throw error;
    }
  },

    // En dashboardService.js, añade esta función
  getRepuestosStockBajo: async () => {
    try {
      const response = await api.get('/dashboard/repuestos-stock-bajo');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo repuestos con stock bajo:', error);
      throw error;
    }
  },
};

