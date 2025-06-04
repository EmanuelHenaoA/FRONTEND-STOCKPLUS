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
import {ToolOutlined, UserSwitchOutlined, FundOutlined, CarryOutOutlined, FallOutlined} from "@ant-design/icons";
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
          <CarryOutOutlined style={{fontSize: '30px', color: '#feb95a', marginBottom: '10px'}} />
          <h3>Total Vendido Del Mes</h3>
          <p className="stat-number">${stats.ventasMes.total.toLocaleString('es-ES')}</p>
          <p className="stat-subtitle"><strong>Cantidad: </strong>{stats.ventasMes.cantidad} Ventas</p>
        </div>
        
        <div className="stat-card">
          <ToolOutlined style={{fontSize: '30px', color: '#f2c8ed', marginBottom: '10px'}} />
          <h3>Total Repuestos</h3>
          <p className="stat-number">{stats.totalRepuestos}</p>
          <p className="stat-subtitle">Activos</p>
        </div>
        
        <div className="stat-card">
          <UserSwitchOutlined style={{fontSize: '30px', color: '#a9dfd8', marginBottom: '10px'}}/>
          <h3>Total Clientes</h3>
          <p className="stat-number">{stats.totalClientes}</p>
        </div>
        
        <div className="stat-card alert">
          <FallOutlined style={{fontSize: '30px', color: '#e74c3c ', marginBottom: '10px'}} />
          <h3>Stock Bajo</h3>
          <p className="stat-number">{stats.repuestosStockBajo}</p>
          <p className="stat-subtitle">Repuestos</p>
        </div>
      </div>

{/* Gráficos principales */}
      <div className="charts-container">
        <div className="chart-item">
        <TopClientes />
        </div>
        
        <div className="chart-item">
          <VentasSemanales />
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
    <RepuestosMasVendidos />
  </div>
</div>
</div>

{/* Tablas de productos */}
  <div className="chart-item-ultimate">
    <RepuestosStockBajo />
  </div>
  
  {/* <div className="chart-item">
    <RepuestosMayorIngreso />
  </div> */}


</div>
      </Content>
    </Layout>
    
  </Layout>
  );
};

export default Dashboard;

