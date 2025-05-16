import { Menu, Modal } from "antd";
import { CheckCircleOutlined, AppstoreOutlined, TruckOutlined, TeamOutlined, ShoppingOutlined, SafetyCertificateOutlined, ToolOutlined, ShoppingCartOutlined, HomeOutlined, SettingOutlined, UserOutlined, DollarOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useLocation} from "react-router-dom";
import { cerrarSesion } from "../services/authService";


export const MenuList = () => {
  const navigate = useNavigate()
  const location = useLocation();

  const handleMenuClick = (e) => {
    if (e.key === '/logout') {
      // Mostrar modal de confirmación
      Modal.confirm({
        title: '¿Estás seguro de cerrar sesión?',
        content: 'Se cerrará tu sesión actual en el sistema.',
        okText: 'Si, cerrar sesión',
        cancelText: 'No, cancelar',
        onOk() {
          // Ejecutar función de cerrar sesión
          cerrarSesion();
          // Redireccionar al login
          navigate('/login');
        },
        // No es necesario un onCancel, por defecto solo cierra el modal
      });
    } else {
      // Navegar normalmente para el resto de opciones
      navigate(e.key);
    }
  };
  const menuItems = [
    { key: "/dashboard", icon: <HomeOutlined />, label: "Inicio" },
    { key: "/usuarios", icon: <UserOutlined />, label: "Usuarios" },
    { key: "/clientes", icon: <TeamOutlined />, label: "Clientes" },
    { key: "/ventas", icon: <ShoppingOutlined />, label: "Ventas" },
    { key: "/proveedores", icon: <TruckOutlined />, label: "Proveedores" },
    { key: "/compras", icon: <ShoppingCartOutlined />, label: "Compras" },
    { key: "/categorias", icon: <AppstoreOutlined />, label: "Categorias" },
    { key: "/marcas", icon: <DollarOutlined />, label: "Marcas" },
    { key: "/repuestos", icon: <ToolOutlined />, label: "Repuestos" },
    {
      key: "subsettings",
      icon: <SettingOutlined />,
      label: "Configuración",
      className: "subsettings-menu",
      children: [
        { key: "/roles", label: "Roles", icon: <CheckCircleOutlined />, className:"submenu-item"},
        { key: "/permisos", label: "Permisos", icon: <SafetyCertificateOutlined /> }
      ],
    },
    { key: '/logout', icon: <LogoutOutlined className="logout-icon"/>, label: "Cerrar Sesion"},

  ];

  return <Menu theme="dark" mode="inline" className="menu-bar" selectedKeys={[location.pathname]}  onClick={handleMenuClick } items={menuItems} />;
};

