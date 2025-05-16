import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { dashboardService } from '../../services/dashboardService';

// Registrar los componentes de ChartJS
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const VentasSemanales = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getVentasSemanales();
        
        if (response.success) {
          const data = response.data;
          
          // Preparar datos para el gráfico
          setChartData({
            labels: data.map(item => item.periodo),
            datasets: [
              {
                label: 'Ventas Semanales',
                data: data.map(item => item.total),
                backgroundColor: 'green',
              }
            ]
          });
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas Semanales',
      },
    },
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chart-container">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default VentasSemanales;