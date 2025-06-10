import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button, Form, Table, Input } from 'antd';
import { Typography } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import RolesModalForm from '../components/modals/RolesModalForm';
import { getRoles, crearRol, actualizarRol, eliminarRol, cambiarEstadoRol } from '../services/rolesService';
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

export const RolesPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRoles, setFilteredRoles] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Crear instancia del formulario
    const { Title, Text } = Typography;
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [changingStatusId, setChangingStatusId] = useState(null);
    const [selectedRol, setSelectedRol] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [pendingFormData, setPendingFormData] = useState(null);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            searchable: true,
        },
        {
            title: 'Permisos',
            key: 'permisos',
            render: (_, record) => {
              // Manejar múltiples estructuras de datos posibles
              if (!record.permisos) return 0;
              
              if (Array.isArray(record.permisos)) {
                return record.permisos.length;
              }
              
              if (typeof record.permisos === 'number') {
                return record.permisos;
              }
              
              return 0;
            }
        },
        {
            title: 'Fecha Creación',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-ES') : 'N/A'
        },
        {
            title: 'Última Actualización',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
        },
              {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (estado) => (
                <span style={{ 
                    background: estado === 'Activo' ?  '#28D4471E' : '#D329291E',
                    color: estado === 'Activo' ?  '#53d447' : '#d32929' ,
                    padding: '8px',
                    borderRadius: '0.25rem',
                    border: '1px solid'
                    
                    }}>
                    {estado}
                </span>
            ) 
        },
    ];

    
      
    // Cargar roles
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await getRoles();
            setRoles([]);
            console.log('Datos de roles:', data); // Ver la estructura real
            setRoles(data);
        } catch (error) {
            console.error('Error al cargar roles:', error);
            message.error('Error al cargar los roles');
            
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Cargar datos al montar
    useEffect(() => {
        fetchRoles();
    }, []);

      useEffect(() => {
            if (!searchTerm) {
              setFilteredRoles(roles);
              return;
            }
            
            const filtered = roles.filter(rol => {
              const searchTermLower = searchTerm.toLowerCase();
              return (
                (rol.nombre && rol.nombre.toLowerCase().includes(searchTermLower)) ||
                (rol.estado && rol.estado.toLowerCase().includes(searchTermLower))
              );
            });
            
            setFilteredRoles(filtered);
          }, [searchTerm, roles]);
    

    // Funciones para manejar acciones
    const handleViewRol = (rol) => {
        console.log('Ver detalles del rol:', rol);
        
        Modal.info({
            title: 'Detalles del Rol',
            width: 600,
            content: (
                <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        {/* <Title level={5}>Información General</Title> */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {/* <Text><strong>ID del Rol:</strong> {rol._id}</Text> */}
                            <Text><strong>Nombre:</strong> {rol.nombre}</Text>
                            <Text><strong>Estado:</strong> {rol.estado}</Text>
                            <Text><strong>Fecha Creación:</strong> {new Date(rol.createdAt).toLocaleString('es-ES')}</Text>
                            {rol.updatedAt && (
                                <Text><strong>Última Actualización:</strong> {new Date(rol.updatedAt).toLocaleString('es-ES')}</Text>
                            )}
                        </div>
                    </div>
                    
                    <Title level={5}>Permisos</Title>
                    {rol.permisos && rol.permisos.length > 0 ? (
                        <Table 
                            dataSource={rol.permisos.map((permiso, index) => ({ 
                                key: index,
                                nombre: permiso.nombre || 'Sin nombre',
                            }))} 
                            columns={[
                                { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
                            ]} 
                            pagination={true}
                            size="small"
                            bordered
                        />
                    ) : (
                        <Text>Este rol no tiene permisos asignados</Text>
                    )}
                </div>
            ),
            okText: 'Cerrar',
        });
    };

    const handleEditRol = (rol) => {
        form.resetFields(); // Resetear el formulario antes de abrir el modal
        setModalMode('edit');
        setSelectedRol(rol);
        setModalVisible(true);
    };

      // Función para manejar el cambio de estado
      const handleToggleStatus = async (rol) => {
        setChangingStatusId(rol._id);
        try {
            const response = await cambiarEstadoRol(rol._id);
            message.success(`Estado del rol cambiado a ${response.rol.estado}`);
            fetchRoles()
        } catch (error) {
            console.error('Error al cambiar estado del rol:', error);
            message.error('Error al cambiar el estado del rol');
        } finally {
            setChangingStatusId(null);
        }
    };

    const handleDeleteRol = (rol) => {
        confirm({
            title: '¿Estás seguro de querer eliminar este rol?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p><strong>Nombre:</strong> {rol.nombre}</p>
                    <p><strong>Permisos asignados:</strong> {rol.permisos ? rol.permisos.length : 0}</p>
                </div>
            ),
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteRolRecord(rol._id);
            },
        });
    };

    const deleteRolRecord = async (rolId) => {
        try {
            await eliminarRol(rolId);
            message.success('Rol eliminado exitosamente');
            fetchRoles();
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            message.error('Error al eliminar el rol');
        }
    };

    // Función para manejar envío del formulario (crear/editar)
    // Función para manejar el envío en RolesPage.jsx
const handleSubmitRol = async (formData) => {
    setPendingFormData(formData);
    setConfirmModalVisible(true);
  };

   const confirmSubmitRol = async () => {
      if (confirmationText.toLowerCase() !== 'confirmar') {
          message.error('Debes escribir "confirmar" para continuar');
          return;
      }
  
      setConfirmLoading(true);
      try {
          if (modalMode === 'add') {
              await crearRol(pendingFormData);
              message.success('Rol creado exitosamente');
          } else {
              const { _id, ...permisoData } = pendingFormData;
              await actualizarRol(_id, permisoData); 
              message.success('Rol actualizado exitosamente');
          }
          setModalVisible(false);
          setConfirmModalVisible(false);
          setConfirmationText('');
          setPendingFormData(null);
          fetchRoles();
      } catch (error) {
          console.error('Error:', error);
          message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} el Rol`);
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
                    title="Roles"
                />
            
                <Content>
                    <div className='container-items'>
                        <div>
                            <SearchBar placeholder="Buscar rol..." onSearch={setSearchTerm}/>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={() => {
                                form.resetFields();
                                setModalMode('add');
                                setSelectedRol(null);
                                setModalVisible(true);
                            }}
                            className='icon-create'
                        >
                            Crear Rol
                        </Button>
                    </div>
              
                    <DataTable 
                        columns={columns}
                        dataSource={filteredRoles}
                        loading={loading}
                        fetchData={fetchRoles}
                        onView={handleViewRol}
                        onEdit={handleEditRol}
                        onDelete={handleDeleteRol}
                        onToggleStatus={handleToggleStatus}  // Nueva prop para manejar cambio de estado
                        toggleStatusLoading={changingStatusId !== null}  // Para controlar estado de carga
                        toggleStatusIdLoading={changingStatusId}  // ID del elemento cambiando estado
                        showToggleStatus={true}  // Mostrar botón de cambio de estado
                    />
                </Content>
            </Layout>
          
            {/* Modal para crear/editar rol */}
            <RolesModalForm
                visible={modalVisible}
                onCancel={() => {
                    form.resetFields();
                    setModalVisible(false);
                }}
                onSubmit={handleSubmitRol}
                initialValues={selectedRol}
                confirmLoading={confirmLoading}
                mode={modalMode}
                form={form}
            />
            {/* Modal de confirmación personalizado */}
            <Modal
                title={`Confirmar ${modalMode === 'add' ? 'Creación' : 'Actualización'} de rol`}
                visible={confirmModalVisible}
                onOk={confirmSubmitRol}
                onCancel={() => {
                    setConfirmModalVisible(false);
                    setConfirmationText('');
                    setPendingFormData(null);
                }}
                confirmLoading={confirmLoading}
                okText="Confirmar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro de que deseas {modalMode === 'add' ? 'crear' : 'actualizar'} este rol?</p>
                <p>Para continuar, escribe <strong>"confirmar"</strong> en el campo de abajo:</p>
                <Input
                    placeholder="Escribe 'confirmar' para continuar"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    onPressEnter={confirmSubmitRol}
                />
            </Modal>
        </Layout>
    );
};

export default RolesPage;