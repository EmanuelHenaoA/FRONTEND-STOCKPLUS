import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import { HeaderComponent } from "../components/HeaderComponent";
import { dashboardService } from '../services/dashboardService';
import VentasSemanales from '../components/dashboard/VentasSemanales';
import TopClientes from '../components/dashboard/TopClientes';
import RepuestosMasVendidos from '../components/dashboard/RepuestosMasVendidos';
import RepuestosMayorIngreso from '../components/dashboard/RepuestosMayorIngreso';
import VentasPorCategoria from '../components/dashboard/VentasPorCategoria';
import VentasMensuales from '../components/dashboard/VentasMensuales';
import RepuestosStockBajo from '../components/dashboard/RepuestosStockBajo';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    ventasMes: { total: 0, cantidad: 0 },
    totalRepuestos: 0,
    totalClientes: 0,
    repuestosStockBajo: 0
  });
  const { Sider, Content } = Layout;
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getEstadisticasGenerales();
        
        if (response.success) {
          setStats(response.data);
        } else {
          setError('Error al cargar estadísticas');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  if (loading) return <div className="loading-container">Cargando dashboard...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  return (
    <Layout>
    <Sider 
      collapsed={collapsed}
      collapsible
      trigger={null}
      className="sidebar"
      width={220}
      collapsedWidth={70}
    >
      <Logo collapsed={collapsed}/>
      <MenuList className="menu-bar"/>
    </Sider>
    
    <Layout className={`main-content ${collapsed ? 'collapsed' : ''}`}>
      <HeaderComponent 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}  
        title="Dashboard"
      />
      
      <Content>
      <div className="dashboard-container">
{/* Cards de estadísticas generales */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Vendido Del Mes</h3>
          <p className="stat-number">${stats.ventasMes.total.toLocaleString('es-ES')}</p>
          <p className="stat-subtitle">{stats.ventasMes.cantidad} ventas</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Repuestos</h3>
          <p className="stat-number">{stats.totalRepuestos}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Clientes</h3>
          <p className="stat-number">{stats.totalClientes}</p>
        </div>
        
        <div className="stat-card alert">
          <h3>Stock Bajo</h3>
          <p className="stat-number">{stats.repuestosStockBajo}</p>
          <p className="stat-subtitle">repuestos</p>
        </div>
      </div>

{/* Gráficos principales */}
      <div className="charts-container">
        <div className="chart-item">
          <VentasSemanales />
        </div>
        
        <div className="chart-item">
        <TopClientes />
        </div>
      </div>

{/* Gráficos de ventas semanales y tablas */}
<div className="charts-container">
  {/* <div className="chart-item">
    <VentasPorCategoria />
    </div> */}
  
  <div className="chart-item">
    <VentasMensuales />
  </div>
  <div className="charts-container">
  <div className="chart-item">
    <RepuestosStockBajo />
  </div>
</div>
</div>

{/* Tablas de productos */}
<div className="charts-container">
  <div className="chart-item">
    <RepuestosMasVendidos />
  </div>
  
  <div className="chart-item">
    <RepuestosMayorIngreso />
  </div>
</div>

</div>
      </Content>
    </Layout>
    
  </Layout>
  );
};

export default Dashboard;

