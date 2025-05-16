import React, { useState, useEffect } from "react";
import { Button, Layout, Avatar, Badge, Dropdown, notification, Spin, Flex } from "antd";
import { 
  MenuOutlined, 
  UserOutlined, 
  BellOutlined, 
  QuestionOutlined,
  LogoutOutlined,
  SettingOutlined,
  WarningOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined, 
  ArrowRightOutlined,
  LockOutlined
} from "@ant-design/icons";
import { getCurrentUser, cerrarSesion } from "../services/authService";
import { dashboardService } from "../services/dashboardService";
import { useNavigate } from "react-router-dom";


export const HeaderComponent = ({ collapsed, setCollapsed, title }) => {
  const navigate = useNavigate();
  
  // Estado para el usuario y notificaciones
  const [currentUser, setCurrentUser] = useState(null);
  const [repuestosStockBajo, setRepuestosStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Cargar datos del usuario y repuestos con stock bajo
  useEffect(() => {
    console.log("Usuario en localStorage:", localStorage.getItem('user'));
    // Cargar usuario desde localStorage
    const user = getCurrentUser();
    console.log("Estructura del usuario:", user); 
    if (user) {
      console.log("Usuario cargado:", user); // Para depuración
      setCurrentUser(user);
    }

    // Modificar en la función fetchRepuestosStockBajo:
      const fetchRepuestosStockBajo = async () => {
        try {
          setLoading(true);
          const response = await dashboardService.getRepuestosStockBajo();
          console.log("Repuestos con stock bajo:", response); // Para depuración
          
          // Extraer los datos del campo 'data' si existe
          const stockData = response.data || response;
          setRepuestosStockBajo(Array.isArray(stockData) ? stockData : []);
        } catch (error) {
          console.error("Error al cargar repuestos con stock bajo:", error);
          notification.error({
            message: "Error",
            description: "No se pudieron cargar las notificaciones de stock"
          });
          setRepuestosStockBajo([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchRepuestosStockBajo();
    

    
    // Recargar datos cada 2 minutos para mayor frecuencia
    const interval = setInterval(fetchRepuestosStockBajo, 1 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Manejar cierre de sesión
  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  // Contenido detallado del perfil de usuario
  const userProfileContent = () => (
    <div style={{ width: 280, padding: "12px 0", background: '#232529', borderRadius: '8px', border: '2px solid white' }}>
      <div style={{ textAlign: "center", marginBottom: "12px", color: 'white'}}>
        <Avatar 
          size={64} 
          icon={<UserOutlined />} 
          style={{ backgroundColor: "#d32929"}} 
          />
        <div style={{ fontWeight: "bold", fontSize: "16px", marginTop: "8px" }}>
          {currentUser?.nombre || 'Usuario'}
        </div>
      </div>
      
      <div style={{ padding: "0 16px" }}>
        <div style={{ margin: "8px 0", display: "flex", alignItems: "center", color: 'white' }}>
          <MailOutlined style={{ marginRight: "8px", color: "#d32929" }} />
          <span>{currentUser?.email || 'No disponible'}</span>
        </div>
        
        <div style={{ margin: "8px 0", display: "flex", alignItems: "center", color: 'white' }}>
          <IdcardOutlined style={{ marginRight: "8px", color: "#d32929" }} />
          <span>Documento: {currentUser?.documento || 'No disponible'}</span>
        </div>
        
        <div style={{ margin: "8px 0", display: "flex", alignItems: "center" , color: 'white'}}>
          <PhoneOutlined style={{ marginRight: "8px", color: "#d32929" }} />
          <span>Teléfono: {currentUser?.telefono || 'No disponible'}</span>
        </div>

        <div style={{ margin: "8px 0", display: "flex", alignItems: "center" , color: 'white'}}>
          <IdcardOutlined style={{ marginRight: "8px", color: "#d32929" }} />
          <span>Direccion: {currentUser?.direccion || 'No disponible'}</span>
        </div>
        
        {/* <div style={{ margin: "8px 0", display: "flex", alignItems: "center" }}>
          <UserOutlined style={{ marginRight: "8px", color: "#d32929" }} />
          <span>Rol: {currentUser?.rol.nombre || 'No disponible'}</span>
        </div> */}
        
        <div style={{ margin: "8px 0", display: "flex", alignItems: "center", color: 'white' }}>
          <span style={{ 
            display: "inline-block", 
            width: "8px", 
            height: "8px", 
            borderRadius: "50%", 
            backgroundColor: currentUser?.estado === "Activo" ? "#52c41a" : "#ff4d4f",
            marginRight: "8px"
          }}></span>
          <span>Estado: {currentUser?.estado || 'No disponible'}</span>
        </div>
      </div>
      
      <div style={{ borderTop: "1px solid #f0f0f0", marginTop: "12px", paddingTop: "12px" }}>
        {/* <div 
          style={{ 
            padding: "8px 16px", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center" 
          }}
          onClick={() => {
            setUserMenuOpen(false);
            navigate("/forgot-password");
          }}
        >
          <LockOutlined style={{ marginRight: "8px" }} />
          <span>Cambiar Contraseña</span>
        </div> */}
        
        <div 
          style={{ 
            padding: "8px 16px", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center",
            color: "#ff4d4f"
          }}
          onClick={handleLogout}
        >
          <LogoutOutlined style={{ marginRight: "8px" }} />
          <span>Cerrar sesión</span>
        </div>
      </div>
    </div>
  );

  // Función para generar el contenido de las notificaciones
  const getNotificationContent = () => (
    <div style={{ width: 300, maxHeight: 400, overflow: 'auto', background: '#232529', borderRadius: '8px', border: '2px solid white'}}>
      <div style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0', color: 'white' }}>
        Repuestos con Stock Bajo
      </div>
      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Spin tip="Cargando..." />
        </div>
      ) : repuestosStockBajo && repuestosStockBajo.length > 0 ? (
        repuestosStockBajo.map((item, index) => (
          <div key={item.id || index} style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
              <div>
                <div style={{ fontWeight: 'bold' , color: 'white' }}>{item.nombre || item.name || `Repuesto ${index + 1}`}</div>
                <div style={{ color: 'white', fontSize: '12px' }}>
                  Stock actual: <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                    {item.stock || item.existencias || 0}
                  </span> / Ir a comprar <ArrowRightOutlined style={{cursor: 'pointer', color: 'green'}} onClick={() => navigate('/compras')}/>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
          No hay alertas de stock bajo
        </div>
      )}
    </div>
  );

  return (
    <Layout.Header className="header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          className="header-icon"
          onClick={() => setCollapsed(!collapsed)}
          icon={<MenuOutlined />}
        />
          <h1 className="header-title">{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dropdown 
          dropdownRender={() => getNotificationContent()}
          trigger={['click']}
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
          placement="bottomRight"
        >
          <Badge 
            count={repuestosStockBajo?.length || 0} 
            size="small" 
            offset={[-7, 5]}
            style={{ backgroundColor: repuestosStockBajo?.length > 0 ? '#ff4d4f' : '##2a2c30' }}
          >
            <Avatar 
              className="profile-icon" 
              icon={<BellOutlined />} 
              style={{ 
                cursor: 'pointer', 
                background: repuestosStockBajo?.length > 0 ? '#ff4d4f' : (notificationsOpen ? '#ff4d4f' : '#2a2c30') 
              }} 
            />
          </Badge>
        </Dropdown>
        
        <Avatar 
          className="profile-icon" 
          icon={<QuestionOutlined />} 
          onClick={() => navigate("/ayuda")}
        />
        
        <Dropdown 
          dropdownRender={userProfileContent}
          trigger={['click']}
          open={userMenuOpen}
          onOpenChange={setUserMenuOpen}
          placement="bottomRight"
        >
          <Avatar 
            className="profile-icon" 
            icon={<UserOutlined />} 
            style={{ background: (userMenuOpen? '#ff4d4f' : '#2a2c30')}}
          />
        </Dropdown>
      </div>
    </Layout.Header>
  );
};