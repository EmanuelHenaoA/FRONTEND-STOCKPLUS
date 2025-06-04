import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dashboardService } from '../../services/dashboardService';

// Registrar componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VentasMensuales = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para formatear el periodo (YYYY-MM) a nombre de mes
  const formatearPeriodo = (periodo) => {
    const [year, month] = periodo.split('-');
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return `${meses[parseInt(month) - 1]} ${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getVentasPorMes();
        
        if (response.success) {
          const data = response.data;
          
          // Preparar datos para el gráfico
          setChartData({
            labels: data.map(item => formatearPeriodo(item.periodo)),
            datasets: [
              {
                label: 'Total Ventas',
                data: data.map(item => item.totalVentas),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.3,
              },
              {
                label: 'Cantidad de Ventas',
                data: data.map(item => item.cantidad),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                tension: 0.3,
                yAxisID: 'y1',
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
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Ventas ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString('es-ES');
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Cantidad'
        },
        // Para que no se superpongan las líneas de la cuadrícula
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas Mensuales (Últimos 12 meses)',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label === 'Total Ventas') {
                label += '$' + context.parsed.y.toLocaleString('es-ES');
              } else {
                label += context.parsed.y;
              }
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
      <h2>Mensuales</h2>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default VentasMensuales;