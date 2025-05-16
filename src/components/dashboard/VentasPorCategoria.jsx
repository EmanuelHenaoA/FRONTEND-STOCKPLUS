import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { dashboardService } from '../../services/dashboardService';

// Registrar componentes de ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

const VentasPorCategoria = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colores para el gráfico de pastel
  const backgroundColors = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(199, 199, 199, 0.8)',
    'rgba(83, 102, 255, 0.8)',
    'rgba(40, 159, 64, 0.8)',
    'rgba(210, 105, 30, 0.8)'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getVentasPorCategoria();
        
        if (response.success) {
          const data = response.data;
          
          // Preparar datos para el gráfico
          setChartData({
            labels: data.map(item => item.categoria),
            datasets: [
              {
                label: 'Ventas por Categoría',
                data: data.map(item => item.totalVentas),
                backgroundColor: backgroundColors,
                borderWidth: 1,
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
        position: 'right',
      },
      title: {
        display: true,
        text: 'Ventas por Categoría',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += '$' + context.raw.toLocaleString('es-ES');
            }
            return label;
          }
        }
      }
    },
  };

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chart-container">
      <h3>Ventas por Categoría</h3>
      <div className="pie-chart-wrapper">
        <Pie options={options} data={chartData} />
      </div>
    </div>
  );
};

export default VentasPorCategoria;