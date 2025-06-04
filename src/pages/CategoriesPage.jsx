import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button, Form } from 'antd';
import { Typography } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import { getCategorias, cambiarEstadoCategoria, updateCategoria, deleteCategoria, createCategoria} from '../services/catService';
import { useNavigate } from "react-router-dom";
import CategoriesModalForm from '../components/modals/CatModalForm';

const { confirm } = Modal;

export const CategoriesPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Crear instancia del formulario
    const { Title, Text } = Typography;
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [changingStatusId, setChangingStatusId] = useState(null);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
            searchable: true,
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

    
      
   
    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const response = await getCategorias();
            console.log('Datos de categorias:', response); // Log the full response
            
            // Check if the response is an object with a data property or other structure
            const data = Array.isArray(response) 
                ? response 
                : (response.categorias || response.data || []);
                
            setCategorias(data);
        } catch (error) {
            console.error('Error al cargar categorias:', error);
            message.error('Error al cargar los categorias');
            
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Cargar datos al montar
    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
          setFilteredCategorias(categorias);
          return;
        }
        
        const filtered = categorias.filter(categoria => {
          const searchTermLower = searchTerm.toLowerCase();
          return (
            (categoria.nombre && categoria.nombre.toLowerCase().includes(searchTermLower)) ||
            (categoria.estado && categoria.estado.toLowerCase().includes(searchTermLower))
          );
        });
        
        setFilteredCategorias(filtered);
      }, [searchTerm, categorias]);

    // Funciones para manejar acciones
    const handleViewCategoria = (categoria) => {
        console.log('Ver detalles del categoria:', categoria);
        
        Modal.info({
            title: 'Detalles de la Categoria',
            width: 600,
            content: (
                <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {/* <Text><strong>ID:</strong> {categoria._id}</Text> */}
                            <Text><strong>Nombre:</strong> {categoria.nombre}</Text>
                            <Text><strong>Estado:</strong> {categoria.estado}</Text>
                            <Text><strong>Fecha y Hora de Creación:</strong> {new Date(categoria.createdAt).toLocaleString('es-ES')}</Text>
                            {categoria.updatedAt && (
                                <Text><strong>Última Actualización:</strong> {new Date(categoria.updatedAt).toLocaleString('es-ES')}</Text>
                            )}
                        </div>
                    </div>
                </div>
            ),
            okText: 'Cerrar',
        });
    };

    const handleEditCategoria = (categoria) => {
        form.resetFields(); // Resetear el formulario antes de abrir el modal
        setModalMode('edit');
        setSelectedCategoria(categoria);
        setModalVisible(true);
    };

      // Función para manejar el cambio de estado
      const handleToggleStatus = async (categoria) => {
        setChangingStatusId(categoria._id);
        try {
            const response = await cambiarEstadoCategoria(categoria._id);
            message.success(`Estado del categoria cambiado a ${response.categoria.estado}`);
            fetchCategorias()
        } catch (error) {
            console.error('Error al cambiar estado del categoria:', error);
            message.error('Error al cambiar el estado del categoria');
        } finally {
            setChangingStatusId(null);
        }
    };

    const handleDeleteCategoria = (categoria) => {
        confirm({
            title: '¿Estás seguro de querer eliminar esta categoria?',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p><strong>Nombre:</strong> {categoria.nombre}</p>
                    <p><strong>Estado:</strong> {categoria.estado}</p>
                </div>
            ),
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                deleteCategoriaRecord(categoria._id);
            },
        });
    };

    const deleteCategoriaRecord = async (categoriaId) => {
        try {
            await deleteCategoria(categoriaId);
            message.success('Categoria eliminada exitosamente');
            fetchCategorias();
        } catch (error) {
            console.error('Error al eliminar categoria:', error);
            message.error('Error al eliminar el categoria');
        }
    };

    // Función para manejar envío del formulario (crear/editar)

const handleSubmitCategoria = async (formData) => {
    setConfirmLoading(true);
    try {
      if (modalMode === 'add') {
        await createCategoria(formData);
        message.success('Categoria creada exitosamente');
      } else {
        // Actualizar rol existente - asegúrate de que el id se pase correctamente
        const { _id, ...categoriaData } = formData; // Extraer ID
        await updateCategoria(_id, categoriaData); 
        message.success('Categoria actualizado exitosamente');
      }
      setModalVisible(false);
      fetchCategorias();
    } catch (error) {
      console.error('Error:', error);
      message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} el rol`);
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
                    title="Categorias"
                />
            
                <Content>
                    <div className='container-items'>
                        <div>
                            <SearchBar placeholder="Buscar categoria..." onSearch={setSearchTerm}/>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={() => {
                                form.resetFields();
                                setModalMode('add');
                                setSelectedCategoria(null);
                                setModalVisible(true);
                            }}
                            className='icon-create'
                        >
                            Crear Categoria
                        </Button>
                    </div>
              
                    <DataTable 
                        columns={columns}
                        dataSource={filteredCategorias}
                        loading={loading}
                        fetchData={fetchCategorias}
                        onView={handleViewCategoria}
                        onEdit={handleEditCategoria}
                        onDelete={handleDeleteCategoria}
                        onToggleStatus={handleToggleStatus}  // Nueva prop para manejar cambio de estado
                        toggleStatusLoading={changingStatusId !== null}  // Para controlar estado de carga
                        toggleStatusIdLoading={changingStatusId}  // ID del elemento cambiando estado
                        showToggleStatus={true}  // Mostrar botón de cambio de estado
                    />
                </Content>
            </Layout>
          
            {/* Modal para crear/editar rol */}
            <CategoriesModalForm
                visible={modalVisible}
                onCancel={() => {
                    form.resetFields();
                    setModalVisible(false);
                }}
                onSubmit={handleSubmitCategoria}
                initialValues={selectedCategoria}
                confirmLoading={confirmLoading}
                mode={modalMode}
                form={form}
            />
        </Layout>
    );
};

export default CategoriesPage;