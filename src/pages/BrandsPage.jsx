import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button, Form } from 'antd';
import { Typography } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import { getMarcas, createMarca, updateMarca, deleteMarca, cambiarEstadoMarca} from '../services/brandsService';
import { useNavigate } from "react-router-dom";
import CategoriesModalForm from '../components/modals/CatModalForm';
import BrandsModalForm from '../components/modals/BrandsModalForm';

const { confirm } = Modal;

export const BransPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [marcas, setMarcas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMarcas, setFilteredMarcas] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Crear instancia del formulario
    const { Title, Text } = Typography;
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [changingStatusId, setChangingStatusId] = useState(null);
    const [selectedMarca, setSelectedMarca] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Fecha Creación',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }) : 'No se puede encontrar'
        },
        {
            title: 'Última Actualización',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
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

    
    const fetchMarcas = async () => {
        setLoading(true);
        try {
            const response = await getMarcas();
            console.log('Datos de marcas:', response); // Log the full response
            
            // Check if the response is an object with a data property or other structure
            const data = Array.isArray(response) 
                ? response 
                : (response.marcas || response.data || []);
                
            setMarcas(data);
        } catch (error) {
            console.error('Error al cargar marcas:', error);
            message.error('Error al cargar las marcas');
            
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Cargar datos al montar
    useEffect(() => {
        fetchMarcas();
    }, []);


      useEffect(() => {
        if (!searchTerm) {
          setFilteredMarcas(marcas);
          return;
        }
        
        const filtered = marcas.filter(marca => {
          const searchTermLower = searchTerm.toLowerCase();
          return (
            (marca.nombre && marca.nombre.toLowerCase().includes(searchTermLower)) ||
            (marca.estado && marca.estado.toLowerCase().includes(searchTermLower))
          );
        });
        
        setFilteredMarcas(filtered);
      }, [searchTerm, marcas]);

    // Funciones para manejar acciones
    const handleViewMarca = (marca) => {
        console.log('Ver detalles del marca:', marca);
        
        Modal.info({
            title: 'Detalles de la Marca',
            width: 600,
            content: (
                <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <Title level={5}>Información General</Title>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {/* <Text><strong>ID:</strong> {marca._id}</Text> */}
                            <Text><strong>Nombre:</strong> {marca.nombre}</Text>
                            <Text><strong>Estado:</strong> {marca.activo ? 'Activo' : 'Inactivo'}</Text>
                            {marca.updatedAt && (
                                <Text><strong>Última Actualización:</strong> {new Date(marca.updatedAt).toLocaleString('es-ES')}</Text>
                            )}
                            <Text><strong>Fecha y hora de Creación:</strong> {new Date(marca.createdAt).toLocaleString('es-ES')}</Text>
                        </div>
                    </div>
                </div>
            ),
            okText: 'Cerrar',
        });
    };

    const handleEditMarca = (marca) => {
        form.resetFields(); // Resetear el formulario antes de abrir el modal
        setModalMode('edit');
        setSelectedMarca(marca);
        setModalVisible(true);
    };

      // Función para manejar el cambio de estado
      const handleToggleStatus = async (marca) => {
        setChangingStatusId(marca._id);
        try {
            const response = await cambiarEstadoMarca(marca._id);
            message.success(`Estado del marca cambiado a ${response.marca.estado}`);
            fetchMarcas()
        } catch (error) {
            console.error('Error al cambiar estado del marca:', error);
            message.error('Error al cambiar el estado del marca');
        } finally {
            setChangingStatusId(null);
        }
    };

    const handleDeleteMarca = (marca) => {
        confirm({
            title: '¿Estás seguro de querer eliminar esta marca?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p><strong>Nombre:</strong> {marca.nombre}</p>
                    <p><strong>Estado:</strong> {marca.estado}</p>
                </div>
            ),
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteMarcaRecord(marca._id);
            },
        });
    };

    const deleteMarcaRecord = async (marcaId) => {
        try {
            await deleteMarca(marcaId);
            message.success('Marca eliminada exitosamente');
            fetchMarcas()
        } catch (error) {
            console.error('Error al eliminar marca:', error);
            message.error('Error al eliminar el marca');
        }
    };

    // Función para manejar envío del formulario (crear/editar)

const handleSubmitMarca = async (formData) => {
    setConfirmLoading(true);
    try {
      if (modalMode === 'add') {
        await createMarca(formData);
        message.success('Marca creada exitosamente');
      } else {
        // Actualizar rol existente - asegúrate de que el id se pase correctamente
        const { _id, ...marcaData } = formData; // Extraer ID
        await updateMarca(_id, marcaData); 
        message.success('Marca actualizado exitosamente');
      }
      setModalVisible(false);
      fetchMarcas()
    } catch (error) {
      console.error('Error:', error);
      message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} la marca`);
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
                    title="Marcas"
                />
            
                <Content>
                    <div className='container-items'>
                        <div>
                            <SearchBar placeholder="Buscar marca..." onSearch={setSearchTerm}/>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={() => {
                                form.resetFields();
                                setModalMode('add');
                                setSelectedMarca(null);
                                setModalVisible(true);
                            }}
                            className='icon-create'
                        >
                            Crear Marca
                        </Button>
                    </div>
              
                    <DataTable 
                        columns={columns}
                        dataSource={filteredMarcas}
                        loading={loading}
                        fetchData={fetchMarcas}
                        onView={handleViewMarca}
                        onEdit={handleEditMarca}
                        onDelete={handleDeleteMarca}
                        onToggleStatus={handleToggleStatus}  // Nueva prop para manejar cambio de estado
                        toggleStatusLoading={changingStatusId !== null}  // Para controlar estado de carga
                        toggleStatusIdLoading={changingStatusId}  // ID del elemento cambiando estado
                        showToggleStatus={true}  // Mostrar botón de cambio de estado
                    />
                </Content>
            </Layout>
          
            {/* Modal para crear/editar rol */}
            <BrandsModalForm
                visible={modalVisible}
                onCancel={() => {
                    form.resetFields();
                    setModalVisible(false);
                }}
                onSubmit={handleSubmitMarca}
                initialValues={selectedMarca}
                confirmLoading={confirmLoading}
                mode={modalMode}
                form={form}
            />
        </Layout>
    );
};

export default BransPage;