import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button, Form, Typography } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import ClientsModalForm from '../components/modals/ClientsModalForm';
import api from '../services/axiosConfig';
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;
const { Title, Text } = Typography;

export const ClientsPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
      },
           {
        title: 'Documento',
        dataIndex: 'documento',
        key: 'documento',
      },
      {
        title: 'Teléfono',
        dataIndex: 'telefono',
        key: 'telefono',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      // {
      //   title: 'Fecha Creación',
      //   dataIndex: 'createdAt',
      //   key: 'createdAt',
      //   render: (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric',
      //     hour: '2-digit',
      //     minute: '2-digit'
      //   })
      // },
      // {
      //   title: 'Última Actualización',
      //   dataIndex: 'updatedAt',
      //   key: 'updatedAt',
      //   render: (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric',
      //     hour: '2-digit',
      //     minute: '2-digit'
      //   })
      // },
    ];
      
    // Función para cargar los datos
    const fetchClientes = async () => {
        setLoading(true);
        try {
          const response = await api.get('/clientes');
          console.log('Respuesta API clientes:', response.data);
          
          if (response.data && response.data.clientes) {
            setClientes(response.data.clientes);
          } else if (Array.isArray(response.data)) {
            setClientes(response.data);
          } else {
            console.error('Formato de respuesta inesperado:', response.data);
            setClientes([]);
          }
        } catch (error) {
          console.error('Error al cargar clientes:', error);
          message.error('Error al cargar los clientes');
          setClientes([]);
          
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
    };

    // useEffect para fetchClientes
    useEffect(() => {
      const loadClientes = async () => {
          await fetchClientes();
          console.log("Estado de clientes después de cargar (async):", clientes);
      };
      loadClientes();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Agregar este useEffect para monitorear cambios en el estado de clientes
    useEffect(() => {
      console.log("Clientes actualizado:", clientes);
    }, [clientes]);

    useEffect(() => {
          if (!searchTerm) {
            setFilteredClients(processedClientes);
            return;
          }

          const filtered = processedClientes.filter(cliente => { // Cambiar sales por processedSales
            const searchTermLower = searchTerm.toLowerCase();
            return (
              (cliente.telefono && String(cliente.telefono).toLowerCase().includes(searchTermLower)) ||
              (cliente.email && cliente.email.toLowerCase().includes(searchTermLower)) ||
              (cliente.clienteNombre && cliente.clienteNombre && cliente.clienteNombre.toLowerCase().includes(searchTermLower)) ||
              (cliente.estado && cliente.estado.toLowerCase().includes(searchTermLower))
              
            );
          });
          setFilteredClients(filtered);
        }, [searchTerm, clientes]);

    // Funciones para manejar acciones
    const handleViewCliente = (cliente) => {
        console.log('Ver detalles del cliente:', cliente);
        
        Modal.info({
            title: 'Detalles del Cliente',
            width: 500,
            content: (
                <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {/* <Text><strong>ID:</strong> {cliente._id}</Text> */}
                            <Text><strong>Fecha Creación:</strong> {new Date(cliente.createdAt).toLocaleString('es-ES')}</Text>
                            {cliente.updatedAt && (
                                <Text><strong>Última Actualización:</strong> {new Date(cliente.updatedAt).toLocaleString('es-ES')}</Text>
                            )}
                            <Text><strong>Nombre:</strong> {cliente.nombre}</Text>
                            <Text><strong>Teléfono:</strong> {cliente.telefono}</Text>
                            <Text><strong>Email:</strong> {cliente.email}</Text>
                        </div>
                    </div>
                </div>
            ),
            okText: 'Cerrar',
        });
    };

    const handleEditCliente = (cliente) => {
        console.log('Editar Cliente:', cliente);
        form.resetFields(); // Resetear el formulario antes de abrir el modal
        setModalMode('edit');
        setSelectedCliente(cliente);
        setModalVisible(true);
    };

    const handleDeleteCliente = (cliente) => {
        console.log('handleDeleteCliente llamado con:', cliente);
        confirm({
          title: '¿Estás seguro de querer eliminar este cliente?',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                <p><strong>Email:</strong> {cliente.email}</p>
            </div>
          ),
          okText: 'Sí, eliminar',
          okType: 'danger',
          cancelText: 'Cancelar',
          onOk() {
            console.log('Confirmación aceptada, llamando a deleteClienteRecord con ID:', cliente._id);
            deleteClienteRecord(cliente._id);
          },
        });
    };

    const deleteClienteRecord = async (clienteId) => {
        console.log('deleteClienteRecord llamado con ID:', clienteId);
        try {
          const response = await api.delete(`/clientes/${clienteId}`);
          console.log('Respuesta del servidor:', response.data);
          message.success('Cliente eliminado exitosamente');
          fetchClientes()
        } catch (error) {
          console.error('Error al eliminar cliente:', error);
          message.error('Error al eliminar el cliente');
        }
    };

    // Función para manejar envío del formulario (crear/editar)
    const handleSubmitCliente = async (formData) => {
        setConfirmLoading(true);
        try {
          if (modalMode === 'add') {
            // Crear nuevo cliente
            await api.post('/clientes', formData);
            message.success('Cliente creado exitosamente');
          } else {
            // Actualizar cliente existente
            await api.put(`/clientes/${formData._id}`, formData);
            message.success('Cliente actualizado exitosamente');
          }
          setModalVisible(false);
          fetchClientes()
        } catch (error) {
          console.error('Error:', error);
          message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} el cliente`);
        } finally {
          setConfirmLoading(false);
        }
    };

    const processedClientes = clientes.map(cliente => ({
        ...cliente,
        key: cliente._id, // Asegurar que cada fila tenga una key única
    }));

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
          
          <Layout  className={`main-content ${collapsed ? 'collapsed' : ''}`}>
            <HeaderComponent 
              collapsed={collapsed} 
              setCollapsed={setCollapsed}  
              title="Clientes"
            />
            
            <Content>
              <div className='container-items'>
                <div>
                  <SearchBar placeholder="Buscar cliente..." onSearch={setSearchTerm}/>
                </div>
                <Button 
                  type="primary" 
                  icon={<UserAddOutlined/>} 
                  onClick={() => {
                    form.resetFields(); // Resetear el formulario antes de abrir el modal
                    setModalMode('add');
                    setSelectedCliente(null);
                    setModalVisible(true);
                  }}
                  className='icon-create'
                >
                  Crear Cliente
                </Button>
              </div>
              
              <DataTable 
                columns={columns}
                dataSource={searchTerm ? filteredClients : processedClientes}
                loading={loading}
                fetchData={fetchClientes}
                onView={handleViewCliente}
                onEdit={handleEditCliente}
                onDelete={handleDeleteCliente}
              />
            </Content>
          </Layout>
          
          {/* Modal para crear/editar cliente */}
          <ClientsModalForm
            visible={modalVisible}
            onCancel={() => {
              form.resetFields();
              setModalVisible(false);
            }}
            onSubmit={handleSubmitCliente}
            initialValues={selectedCliente}
            confirmLoading={confirmLoading}
            mode={modalMode}
            form={form}
          />
        </Layout>
    );
};

export default ClientsPage;