import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button, Form } from 'antd';
import { Typography } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import { getPermisos, updatePermiso, deletePermiso, createPermiso } from '../services/permissionsService';
import { useNavigate } from "react-router-dom";
import PermissionsModalForm from '../components/modals/PermissionsModalForm';

const { confirm } = Modal;

export const PermissionsPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [permisos, setPermisos] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { Title, Text } = Typography;
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedPermiso, setSelectedPermiso] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            searchable: true,
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
      
    const fetchPermisos = async () => {
        setLoading(true);
        try {
            const response = await getPermisos();
            console.log('Datos de permisos:', response);
            
            // Asegurarse de que estamos trabajando con un array
            const data = Array.isArray(response) 
                ? response 
                : (response.permisos || response.data || []);
                
            setPermisos(data);
        } catch (error) {
            console.error('Error al cargar permisos:', error);
            message.error('Error al cargar los permisos');
            
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Cargar datos al montar
    useEffect(() => {
        fetchPermisos();
    }, []);

    // Funciones para manejar acciones
    const handleViewPermiso = (permiso) => {
        console.log('Ver detalles del permiso:', permiso);
        
        Modal.info({
            title: 'Detalles del Permiso',
            width: 600,
            content: (
                <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <Title level={5}>Información General</Title>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Text><strong>ID:</strong> {permiso._id}</Text>
                            <Text><strong>Nombre:</strong> {permiso.nombre}</Text>
                            <Text><strong>Fecha Creación:</strong> {new Date(permiso.createdAt).toLocaleString('es-ES')}</Text>
                            {permiso.updatedAt && (
                                <Text><strong>Última Actualización:</strong> {new Date(permiso.updatedAt).toLocaleString('es-ES')}</Text>
                            )}
                        </div>
                    </div>
                </div>
            ),
            okText: 'Cerrar',
        });
    };

    const handleEditPermiso = (permiso) => {
        form.resetFields();
        setModalMode('edit');
        setSelectedPermiso(permiso);
        setModalVisible(true);
    };



    const handleDeletePermiso = (permiso) => {
        confirm({
            title: '¿Estás seguro de querer eliminar este permiso?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p><strong>Nombre:</strong> {permiso.nombre}</p>
                    <p><strong>Estado:</strong> {permiso.estado}</p>
                </div>
            ),
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deletePermisoRecord(permiso._id);
            },
        });
    };

    const deletePermisoRecord = async (permisoId) => {
        try {
            await deletePermiso(permisoId);
            message.success('Permiso eliminado exitosamente');
            fetchPermisos()
        } catch (error) {
            console.error('Error al eliminar permiso:', error);
            message.error('Error al eliminar el permiso');
        }
    };

    const handleSubmitPermiso = async (formData) => {
        setConfirmLoading(true);
        try {
            if (modalMode === 'add') {
                await createPermiso(formData);
                message.success('Permiso creado exitosamente');
            } else {
                const { _id, ...permisoData } = formData;
                await updatePermiso(_id, permisoData); 
                message.success('Permiso actualizado exitosamente');
            }
            setModalVisible(false);
            fetchPermisos();
        } catch (error) {
            console.error('Error:', error);
            message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} el permiso`);
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
                    title="Permisos"
                />
            
                <Content>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '35px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <SearchBar placeholder="Buscar permiso..."/>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={() => {
                                form.resetFields();
                                setModalMode('add');
                                setSelectedPermiso(null);
                                setModalVisible(true);
                            }}
                            style={{ backgroundColor: '#d32929', borderColor: '#d32929' }}
                        >
                            Crear Permiso
                        </Button>
                    </div>
              
                    <DataTable 
                        columns={columns}
                        dataSource={permisos}
                        loading={loading}
                        fetchData={fetchPermisos}
                        onView={handleViewPermiso}
                        onEdit={handleEditPermiso}
                        onDelete={handleDeletePermiso}
                        showToggleStatus={true}
                    />
                </Content>
            </Layout>
          
            <PermissionsModalForm
                visible={modalVisible}
                onCancel={() => {
                    form.resetFields();
                    setModalVisible(false);
                }}
                onSubmit={handleSubmitPermiso}
                initialValues={selectedPermiso}
                confirmLoading={confirmLoading}
                mode={modalMode}
                form={form}
            />
        </Layout>
    );
};

export default PermissionsPage;