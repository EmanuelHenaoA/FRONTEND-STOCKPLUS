// UsersPage.jsx
import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import UserModalForm from '../components/modals/UserModalForm';
import { createUser, updateUser, deleteUser, cambiarEstadoUsuario } from '../services/usersService';
import api from '../services/axiosConfig';
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;


export const UsersPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate()
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [changingStatusId, setChangingStatusId] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    

    // Columnas para la tabla de usuarios
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      searchable: true,
    },
    {
      title: 'Documento',
      dataIndex: 'documento',
      key: 'documento',
      searchable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      searchable: true,
    },
    {
      title: 'Telefono',
      dataIndex: 'telefono',
      key: 'nombre',
      searchable: true,
    },
    {
      title: "Rol",
      dataIndex: "rol", // 🔥 Aquí está la referencia al campo `idRol` que ya está populado
      key: "rol",
      render: (rol) => {
          return rol && rol.nombre ? rol.nombre : "Sin rol"; // 🔥 Acceder al nombre en lugar del ID
      }
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
          <span style={{ 
              background: estado === 'Activo' ? 'green' : 'red',
              padding: '8px',
              borderRadius: '10px',
          }}>
              {estado}
          </span>
      ) 
    },
  ];

    // Función para cargar los datos
    const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await api.get('/usuarios');
          console.log('Respuesta API:', response.data);
          
          // Verificar que la respuesta sea un array
          if (Array.isArray(response.data)) {
            setUsers(response.data);
          } else if (response.data && typeof response.data === 'object') {
            // Si es un objeto, intentar encontrar el array (común en APIs)
            // Ej: { usuarios: [...] } o { data: [...] }
            const arrayData = Object.values(response.data).find(item => Array.isArray(item));
            if (arrayData) {
              setUsers(arrayData);
            } else {
              console.error('No se encontró un array en la respuesta:', response.data);
              setUsers([]);
            }
          } else {
            console.error('Formato de respuesta inesperado:', response.data);
            setUsers([]);
          }
        } catch (error) {
          console.error('Error al cargar usuarios:', error);
          message.error('Error al cargar los usuarios');
          setUsers([]);
          
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const [roles, setRoles] = useState([]);


      // Función para cargar roles
      const fetchRoles = async () => {
        try {
          const response = await api.get('/roles'); // Ajusta la URL según tu API
          if (Array.isArray(response.data)) {
            setRoles(response.data);
          } else if (response.data && typeof response.data === 'object') {
            const arrayData = Object.values(response.data).find(item => Array.isArray(item));
            if (arrayData) {
              setRoles(arrayData);
            }
          }
        } catch (error) {
          console.error('Error al cargar roles:', error);
        }
      };

      // Cargar roles al montar el componente
      useEffect(() => {
        fetchRoles();
      }, []);

      useEffect(() => {
        if (!searchTerm) {
          setFilteredUsers(users);
          return;
        }
        
        const filtered = users.filter(user => {
          const searchTermLower = searchTerm.toLowerCase();
          return (
            (user.nombre && user.nombre.toLowerCase().includes(searchTermLower)) ||
            (user.documento && String(user.documento).toLowerCase().includes(searchTermLower)) ||
            (user.telefono && String(user.telefono).toLowerCase().includes(searchTermLower)) ||
            (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
            (user.rol && user.rol.nombre && user.rol.nombre.toLowerCase().includes(searchTermLower))
          );
        });
        
        setFilteredUsers(filtered);
      }, [searchTerm, users]);


  // Funciones para manejar acciones
  const handleViewUser = (user) => {
    console.log('Ver detalles del usuario:', user);
    Modal.info({
      title: 'Detalles del Usuario',
      content: (
        <div>
          <p><strong>ID:</strong> {user._id}</p>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Teléfono:</strong> {user.telefono || 'No especificado'}</p>
          <p><strong>Dirección:</strong> {user.direccion || 'No especificada'}</p>
          <p><strong>Rol:</strong> {
            (() => {
              const rol = user.rol;
              // Si el rol es un objeto
              if (rol && typeof rol === 'object') {
                return rol.nombre || rol.name || JSON.stringify(rol);
              }
              // Si el rol es un ID y tenemos la lista de roles
              if ((typeof rol === 'string' || typeof rol === 'number') && roles) {
                const rolEncontrado = roles.find(r => r._id === rol || r.id === rol);
                if (rolEncontrado) {
                  return rolEncontrado.nombre || rolEncontrado.name;
                }
              }
              // Si no podemos determinar
              return rol || 'No especificado';
            })()
          }</p>
          <p><strong>Estado:</strong> {user.estado}</p>
        </div>
      ),
      width: 500,
    });
  };

  const handleEditUser = (user) => {
    console.log('Editar usuario:', user);
    setModalMode('edit');
    setSelectedUser(user);
    setModalVisible(true);
  };

   // Función para manejar el cambio de estado
        const handleToggleStatus = async (usuario) => {
          setChangingStatusId(usuario._id);
          try {
              const response = await cambiarEstadoUsuario(usuario._id);
              message.success(`Estado del usuario cambiado a ${response.usuario.estado}`);
              fetchUsers()
          } catch (error) {
              console.error('Error al cambiar estado del usuario:', error);
              message.error('Error al cambiar el estado del usuario');
          } finally {
              setChangingStatusId(null);
          }
      };
  

  const handleDeleteUser = (user) => {
    console.log('handleDeleteUser llamado con:', user);
    console.log('Tipo de user:', typeof user);
    console.log('user._id:', user._id);
    confirm({
      title: '¿Estás seguro de eliminar este usuario?',
      icon: <ExclamationCircleOutlined />,
      content: `Usuario: ${user.nombre || user.name}  (${user.email})`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        console.log('Confirmación aceptada, llamando a deleteUserRecord con ID:', user._id);
        deleteUserRecord(user._id);
      },
    });
  };

  const deleteUserRecord = async (userId) => {
    console.log('deleteUserRecord llamado con ID:', userId);
    try {
      const respuesta = await deleteUser(userId);
      console.log('Respuesta del servidor:', respuesta);
      message.success('Usuario eliminado exitosamente');
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      message.error('Error al eliminar el usuario');
    }
  };
    // Función para manejar envío del formulario (crear/editar)
    const handleSubmitUser = async (formData) => {
        setConfirmLoading(true);
        try {
          if (modalMode === 'add') {
            // Crear nuevo usuario
            await createUser(formData);
            message.success('Usuario creado exitosamente');
          } else {
            // Actualizar usuario existente
            await updateUser(formData._id, formData);
            message.success('Usuario actualizado exitosamente');
          }
          setModalVisible(false);
          fetchUsers(); // Recargar lista
        } catch (error) {
          console.error('Error:', error);
          message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} el usuario`);
        } finally {
            setConfirmLoading(false);
          }
        };
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
          title="Usuarios"
        />
        
        <Content>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '35px',}}>
            <SearchBar placeholder="Buscar usuario..." onSearch={setSearchTerm}/>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />} 
              onClick={() => {
                setModalMode('add');
                setSelectedUser(null);
                setModalVisible(true);
              }}
              style={{ backgroundColor: '#d32929', borderColor: '#d32929' }}
            >
              Crear Usuario
            </Button>
          </div>
          
          
          <DataTable 
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            fetchData={fetchUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}  // Nueva prop para manejar cambio de estado
            toggleStatusLoading={changingStatusId !== null}  // Para controlar estado de carga
            toggleStatusIdLoading={changingStatusId}  // ID del elemento cambiando estado
            showToggleStatus={true}  // Mostrar botón de cambio de estado
          />
        </Content>
      </Layout>
         {/* Modal para crear/editar usuario */}
         <UserModalForm
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmitUser}
        initialValues={selectedUser}
        confirmLoading={confirmLoading}
        mode={modalMode}
      />
    </Layout>
  );
};

export default UsersPage;