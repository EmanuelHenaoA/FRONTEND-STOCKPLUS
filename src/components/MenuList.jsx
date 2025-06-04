import { Menu, Modal } from "antd";
import {
  CheckCircleOutlined,
  AppstoreOutlined,
  TruckOutlined,
  TeamOutlined,
  ShoppingOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  DollarOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { cerrarSesion, getCurrentUser } from "../services/authService";
import { useEffect, useState } from "react";

export const MenuList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userPermisos, setUserPermisos] = useState([]);
  
  // Obtener los permisos del usuario al cargar el componente
  useEffect(() => {
  const currentUser = getCurrentUser();
  console.log("Usuario actual:", currentUser);
  
  // Obtener permisos directamente del usuario o del rol
  if (currentUser) {
    // Si los permisos están directamente en el usuario, úsalos
    if (currentUser.permisos && Array.isArray(currentUser.permisos)) {
      console.log("Permisos del usuario:", currentUser.permisos);
      setUserPermisos(currentUser.permisos);
    } 
    // Si no hay permisos directos pero hay un objeto rol con permisos
    else if (currentUser.rol && currentUser.rol.permisos) {
      console.log("Permisos del rol:", currentUser.rol.permisos);
      setUserPermisos(currentUser.rol.permisos);
    } 
    // Si no hay ninguno de los anteriores
    else {
      console.log("No se encontraron permisos para el usuario");
      setUserPermisos([]);
    }
  }
}, []);

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
      });
    } else {
      // Navegar normalmente para el resto de opciones
      navigate(e.key);
    }
  };

  // Definir la configuración de menú con sus permisos asociados
  const menuConfig = [
    { key: "/dashboard", icon: <HomeOutlined />, label: "Inicio", permiso: "verEstadisticas" }, // Dashboard siempre visible para usuarios autenticados
    { key: "/usuarios", icon: <UserOutlined />, label: "Usuarios", permiso: "verUsuario" },
    { key: "/clientes", icon: <TeamOutlined />, label: "Clientes", permiso: "verCliente" },
    { key: "/ventas", icon: <ShoppingOutlined />, label: "Ventas", permiso: "verVenta" },
    { key: "/proveedores", icon: <TruckOutlined />, label: "Proveedores", permiso: "verProveedor" },
    { key: "/compras", icon: <ShoppingCartOutlined />, label: "Compras", permiso: "verCompra" },
    { key: "/categorias", icon: <AppstoreOutlined />, label: "Categorias", permiso: "verCategoria" },
    { key: "/marcas", icon: <DollarOutlined />, label: "Marcas", permiso: "verMarca" },
    { key: "/repuestos", icon: <ToolOutlined />, label: "Repuestos", permiso: "verRepuesto" },
    {
      key: "subsettings",
      icon: <SettingOutlined />,
      label: "Configuración",
      className: "subsettings-menu",
      permiso: "verConfiguracion", // Si el usuario tiene alguno de los permisos hijos, se mostrará esta opción
      children: [
        { key: "/roles", label: "Roles", icon: <CheckCircleOutlined />, className: "submenu-item", permiso: "verRol" },
        { key: "/permisos", label: "Permisos", icon: <SafetyCertificateOutlined />, permiso: "verPermiso" }
      ],
    },
    // Cerrar sesión siempre está disponible para todos los usuarios autenticados
    { key: '/logout', icon: <LogoutOutlined className="logout-icon" />, label: "Cerrar Sesión" },
  ];

// Modifica la función tienePermiso en MenuList.jsx:
const tienePermiso = (permiso) => {
  // Si no se requiere permiso específico, siempre mostrar
  if (!permiso) return true;
  
  // Verificar si el usuario tiene rol de administrador (acceso total)
  const user = getCurrentUser();
  if (user && (user.rol === 'administrador' || user.rol === 'Administrador')) {
    return true;
  }
  
  // Usar el estado userPermisos en lugar de acceder a user.permisos
  return userPermisos.includes(permiso);
};

  // Verificar permisos para el submenú de configuración
  const tieneAlgunPermisoDeConfiguracion = () => {
    // Si el usuario tiene alguno de los permisos del submenú, mostrar el menú de configuración
    return tienePermiso("verRol") || tienePermiso("verPermiso");
  };

  // Filtrar elementos del menú basados en permisos
  const filtrarMenuItems = (items) => {
    return items
      .filter(item => {
        // Caso especial para el submenú de configuración
        if (item.key === "subsettings") {
          return tieneAlgunPermisoDeConfiguracion();
        }
        return tienePermiso(item.permiso);
      })
      .map(item => {
        // Si tiene submenús, filtrar también los submenús
        if (item.children) {
          const filteredChildren = item.children.filter(child => tienePermiso(child.permiso));
          
          // Solo incluir el elemento padre si tiene al menos un hijo con permiso
          if (filteredChildren.length === 0) {
            return null;
          }
          
          return {
            ...item,
            children: filteredChildren,
          };
        }
        
        return item;
      })
      .filter(Boolean); // Eliminar elementos nulos
  };

  const menuItems = filtrarMenuItems(menuConfig);

  return (
    <Menu
      theme="dark"
      mode="inline"
      className="menu-bar"
      selectedKeys={[location.pathname]}
      onClick={handleMenuClick}
      items={menuItems}
    />
  );
};