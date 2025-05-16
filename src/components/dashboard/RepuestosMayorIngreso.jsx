import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';

const RepuestosMayorIngreso = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getRepuestosMayorIngreso();
        
        if (response.success) {
          setRepuestos(response.data);
        } else {
          setError('Error al cargar datos');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="top-revenue-products-container">
      <h3>Repuestos con Mayor Ingreso</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Precio Unitario</th>
              <th>Ingresos Totales</th>
            </tr>
          </thead>
          <tbody>
            {repuestos.map((repuesto) => (
              <tr key={repuesto.id}>
                <td>{repuesto.nombre}</td>
                <td>{repuesto.categoria}</td>
                <td>{repuesto.marca}</td>
                <td>${repuesto.precioVenta?.toLocaleString('es-ES')}</td>
                <td>${repuesto.totalIngreso.toLocaleString('es-ES')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepuestosMayorIngreso;