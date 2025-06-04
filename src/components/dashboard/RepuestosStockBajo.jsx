import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';

const RepuestosStockBajo = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getRepuestosStockBajo();
        
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
    <div className="low-stock-container">
      <h2>Repuestos con Stock Bajo</h2>
      <div className="table-responsive">
        <table className="table">
          <thead style={{color: '#888888'}}>
            <tr>
              <th>Repuesto</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Stock Actual</th>
              {/* <th>Stock Mínimo</th> */}
            </tr>
          </thead>
          <tbody>
            {repuestos.map((repuesto) => (
              <tr key={repuesto.id} className={repuesto.existencias <= repuesto.stockMinimo ? "stock-critical" : ""}>
                <td style={{color: repuesto.existencias === 0 ? '#d32929' : ''}}>{repuesto.nombre}</td>
                <td style={{color: repuesto.existencias === 0 ? '#d32929' : ''}}>{repuesto.categoria}</td>
                <td style={{color: repuesto.existencias === 0 ? '#d32929' : ''}}>{repuesto.marca}</td>
                <td style={{color: repuesto.existencias === 0 ? '#d32929' : ''}}>{repuesto.existencias}</td>
                {/* <td>{repuesto.stockMinimo}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepuestosStockBajo;