import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button, Form, Typography } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import ProvidersModalForm from '../components/modals/ProvidersModalForm';
import api from '../services/axiosConfig';
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;
const { Title, Text } = Typography;

export const ProvidersPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
        searchable: true
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
        searchable: true
      },
      {
        title: 'Fecha Creación',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
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
    ];
      
    // Función para cargar los datos
    const fetchProveedores = async () => {
        setLoading(true);
        try {
          const response = await api.get('/proveedores');
          console.log('Respuesta API proveedores:', response.data);
          
          if (response.data && response.data.proveedores) {
            setProveedores(response.data.proveedores);
          } else if (Array.isArray(response.data)) {
            setProveedores(response.data);
          } else {
            console.error('Formato de respuesta inesperado:', response.data);
            setProveedores([]);
          }
        } catch (error) {
          console.error('Error al cargar proveedores:', error);
          message.error('Error al cargar los proveedores');
          setProveedores([]);
          
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
      const loadProveedores = async () => {
          await fetchProveedores();
          console.log("Estado de proveedores después de cargar (async):", proveedores);
      };
      loadProveedores();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      console.log("Proveedores actualizado:", proveedores);
    }, [proveedores]);
      

    // Funciones para manejar acciones
    const handleViewProveedor = (proveedor) => {
        console.log('Ver detalles del proveedor:', proveedor);
        
        Modal.info({
            title: 'Detalles del Proveedor',
            width: 500,
            content: (
                <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <Title level={5}>Información General</Title>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Text><strong>ID:</strong> {proveedor._id}</Text>
                            <Text><strong>Nombre:</strong> {proveedor.nombre}</Text>
                            <Text><strong>Teléfono:</strong> {proveedor.telefono}</Text>
                            <Text><strong>Email:</strong> {proveedor.email}</Text>
                            <Text><strong>Fecha Creación:</strong> {new Date(proveedor.createdAt).toLocaleString('es-ES')}</Text>
                            {proveedor.updatedAt && (
                                <Text><strong>Última Actualización:</strong> {new Date(proveedor.updatedAt).toLocaleString('es-ES')}</Text>
                            )}
                        </div>
                    </div>
                </div>
            ),
            okText: 'Cerrar',
        });
    };

    const handleEditProveedor = (proveedor) => {
        console.log('Editar proveedor:', proveedor);
        form.resetFields(); // Resetear el formulario antes de abrir el modal
        setModalMode('edit');
        setSelectedProveedor(proveedor);
        setModalVisible(true);
    };

    const handleDeleteProveedor = (proveedor) => {
        console.log('handleDeleteProveedor llamado con:', proveedor);
        confirm({
          title: '¿Estás seguro de querer eliminar este proveedor?',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
                <p><strong>Nombre:</strong> {proveedor.nombre}</p>
                <p><strong>Teléfono:</strong> {proveedor.telefono}</p>
                <p><strong>Email:</strong> {proveedor.email}</p>
            </div>
          ),
          okText: 'Sí, eliminar',
          okType: 'danger',
          cancelText: 'Cancelar',
          onOk() {
            console.log('Confirmación aceptada, llamando a deleteProveedorRecord con ID:', proveedor._id);
            deleteProveedorRecord(proveedor._id);
          },
        });
    };

    const deleteProveedorRecord = async (proveedorId) => {
        console.log('deleteProveedorRecord llamado con ID:', proveedorId);
        try {
          const response = await api.delete(`/proveedores/${proveedorId}`);
          console.log('Respuesta del servidor:', response.data);
          message.success('Proveedor eliminado exitosamente');
          fetchProveedores();
        } catch (error) {
          console.error('Error al eliminar proveedor:', error);
          message.error('Error al eliminar el proveedor');
        }
    };

    // Función para manejar envío del formulario (crear/editar)
    const handleSubmitProveedor = async (formData) => {
        setConfirmLoading(true);
        try {
          if (modalMode === 'add') {

            await api.post('/proveedores', formData);
            message.success('Proveedor creado exitosamente');
          } else {

            await api.put(`/proveedores/${formData._id}`, formData);
            message.success('Proveedor actualizado exitosamente');
          }
          setModalVisible(false);
          fetchProveedores();
        } catch (error) {
          console.error('Error:', error);
          message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} el proveedor`);
        } finally {
          setConfirmLoading(false);
        }
    };

    const processedProveedores = proveedores.map(proveedor => ({
        ...proveedor,
        key: proveedor._id, // Asegurar que cada fila tenga una key única
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
          
          <Layout className={`main-content ${collapsed ? 'collapsed' : ''}`}>
            <HeaderComponent 
              collapsed={collapsed} 
              setCollapsed={setCollapsed}  
              title="Proveedores"
            />
            
            <Content>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '35px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <SearchBar placeholder="Buscar proveedor..."/>
                </div>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => {
                    form.resetFields(); // Resetear el formulario antes de abrir el modal
                    setModalMode('add');
                    setSelectedProveedor(null);
                    setModalVisible(true);
                  }}
                  style={{ backgroundColor: '#d32929', borderColor: '#d32929' }}
                >
                  Crear Proveedor
                </Button>
              </div>
              
              <DataTable 
                columns={columns}
                dataSource={processedProveedores}
                loading={loading}
                fetchData={fetchProveedores}
                onView={handleViewProveedor}
                onEdit={handleEditProveedor}
                onDelete={handleDeleteProveedor}
              />
            </Content>
          </Layout>
          
          <ProvidersModalForm
            visible={modalVisible}
            onCancel={() => {
              form.resetFields();
              setModalVisible(false);
            }}
            onSubmit={handleSubmitProveedor}
            initialValues={selectedProveedor}
            confirmLoading={confirmLoading}
            mode={modalMode}
            form={form}
          />
        </Layout>
    );
};

export default ProvidersPage;