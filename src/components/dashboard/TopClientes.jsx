import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';

const TopClientes = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getTopClientes();
        
        if (response.success) {
          setCustomers(response.data);
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
    <div className="top-customers-container">
      <h3>Clientes Principales</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Total Compras</th>
              <th>Total Comprado</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.nombre}</td>
                <td>{customer.totalCompras}</td>
                <td>${customer.montoTotal.toLocaleString('es-ES')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopClientes;