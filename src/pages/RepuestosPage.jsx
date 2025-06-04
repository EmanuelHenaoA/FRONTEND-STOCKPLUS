// RepuestosPage.jsx
import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import RepuestoModalForm from '../components/modals/RepuestosModalForm';
import { createRepuesto, updateRepuesto, deleteRepuesto, cambiarEstadoRepuesto } from '../services/repuestosService';
import api from '../services/axiosConfig';
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

export const RepuestosPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [repuestos, setRepuestos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRepuestos, setFilteredRepuestos] = useState([]);
    const navigate = useNavigate();
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [selectedRepuesto, setSelectedRepuesto] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    
    
    // Estados para categorías y marcas
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);

    // Columnas para la tabla de repuestos
    const columns = [
        {
            title: 'Código',
            dataIndex: 'idRepuesto',
             render: (estado) => (
                <span style={{ 
                    fontWeight: estado === 'Activo' ?  'bold' : 'bold' ,
                    }}>
                    {estado}
                </span>
            ) 
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Existencias',
            dataIndex: 'existencias',
            key: 'existencias',
        },
        // {
        //     title: 'Precio Compra',
        //     dataIndex: 'precio',
        //     key: 'precio',
        //     render: (precio) => `$${precio.toLocaleString('es-ES')}`
        // },
        {
            title: 'Precio Venta',
            dataIndex: 'precioVenta',
            key: 'precioVenta',
            render: (precioVenta) => `$${precioVenta.toLocaleString('es-ES')}`
        },
        {
            title: "Categoría",
            dataIndex: "idCategoria",
            key: "categoria",
            render: (categoria) => {
                return categoria && categoria.nombre ? categoria.nombre : "Sin categoría";
            }
        },
        {
            title: "Marca",
            dataIndex: "idMarca",
            key: "marca",
            render: (marca) => {
                return marca && marca.nombre ? marca.nombre : "Sin marca";
            }
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

    // Función para cargar los datos de repuestos
    const fetchRepuestos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/repuestos');
            console.log('Respuesta API:', response.data);
            
            if (response.data && response.data.repuestos) {
                setRepuestos(response.data.repuestos);
            } else {
                console.error('Formato de respuesta inesperado:', response.data);
                setRepuestos([]);
            }
        } catch (error) {
            console.error('Error al cargar repuestos:', error);
            message.error('Error al cargar los repuestos');
            setRepuestos([]);
            
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Cargar repuestos al montar el componente
    useEffect(() => {
        fetchRepuestos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    

    // Función para cargar categorías
        const fetchCategorias = async () => {
          try {
            const response = await api.get('/categorias');
            if (response.data && response.data.categorias) {
              // Filtrar solo categorías activas
              const categoriasActivas = response.data.categorias.filter(
                categoria => categoria.estado === "Activo"
              );
              setCategorias(categoriasActivas);
            } else if (Array.isArray(response.data)) {
              // Filtrar solo categorías activas
              const categoriasActivas = response.data.filter(
                categoria => categoria.estado === "Activo"
              );
              setCategorias(categoriasActivas);
            } else {
              const arrayData = Object.values(response.data).find(item => Array.isArray(item));
              if (arrayData) {
                // Filtrar solo categorías activas
                const categoriasActivas = arrayData.filter(
                  categoria => categoria.estado === "Activo"
                );
                setCategorias(categoriasActivas);
              }
            }
          } catch (error) {
            console.error('Error al cargar categorías:', error);
          }
        };

    // Función para cargar marcas
   // Función para cargar marcas
const fetchMarcas = async () => {
    try {
        const response = await api.get('/marcas');
        if (response.data && response.data.marcas) {
            // Filtrar solo marcas activas
            const marcasActivas = response.data.marcas.filter(
                marca => marca.estado === "Activo"
            );
            setMarcas(marcasActivas);
        } else if (Array.isArray(response.data)) {
            // Filtrar solo marcas activas
            const marcasActivas = response.data.filter(
                marca => marca.estado === "Activo"
            );
            setMarcas(marcasActivas);
        } else if (response.data && typeof response.data === 'object') {
            const arrayData = Object.values(response.data).find(item => Array.isArray(item));
            if (arrayData) {
                // Filtrar solo marcas activas
                const marcasActivas = arrayData.filter(
                    marca => marca.estado === "Activo"
                );
                setMarcas(marcasActivas);
            }
        }
    } catch (error) {
        console.error('Error al cargar marcas:', error);
    }
};  

    // Cargar categorías y marcas al montar el componente
    useEffect(() => {
        fetchCategorias();
        fetchMarcas();
    }, []);

     useEffect(() => {
            if (!searchTerm) {
              setFilteredRepuestos(repuestos);
              return;
            }
            
            const filtered = repuestos.filter(repuesto => {
              const searchTermLower = searchTerm.toLowerCase();
              return (
                (repuesto.nombre && repuesto.nombre.toLowerCase().includes(searchTermLower)) ||
                (repuesto.precioVenta && String(repuesto.precioVenta).toLowerCase().includes(searchTermLower)) ||
                (repuesto.idRepuesto && String(repuesto.idRepuesto).toLowerCase().includes(searchTermLower)) ||
                (repuesto.existencias && String(repuesto.existencias).toLowerCase().includes(searchTermLower)) ||
                (repuesto.precio && String(repuesto.precio).toLowerCase().includes(searchTermLower)) ||
                (repuesto.estado && repuesto.estado.toLowerCase().includes(searchTermLower))
              );
            });
            
            setFilteredRepuestos(filtered);
          }, [searchTerm, repuestos]);
    


    // Funciones para manejar acciones
    const handleViewRepuesto = (repuesto) => {
        console.log('Ver detalles del repuesto:', repuesto);
        Modal.info({
            title: 'Detalles del Repuesto',
            content: (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {/* <p><strong>ID:</strong> {repuesto._id}</p> */}
                    <p><strong>Fecha y Hora de Creación:</strong> {new Date(repuesto.createdAt).toLocaleString('es-ES')}</p>
                    {repuesto.updatedAt && (
                        <p><strong>Última Actualización:</strong> {new Date(repuesto.updatedAt).toLocaleString('es-ES')}</p>
                            )}
                    <p><strong>Nombre:</strong> {repuesto.nombre}</p>
                    <p><strong>Existencias:</strong> {repuesto.existencias}</p>
                    <p><strong>Precio Compra:</strong> ${repuesto.precio?.toLocaleString('es-ES')  || '0.00'}</p>
                    <p><strong>Precio Venta:</strong> ${repuesto.precioVenta?.toLocaleString('es-ES') || '0.00'}</p>
                    <p><strong>Categoría:</strong> {
                        repuesto.idCategoria?.nombre || 'No especificada'
                    }</p>
                    <p><strong>Marca:</strong> {
                        repuesto.idMarca?.nombre || 'No especificada'
                    }</p>
                    <p><strong>Estado:</strong> {repuesto.estado}</p>
                </div>
            ),
            width: 500,
        });
    };

    const handleEditRepuesto = (repuesto) => {
        console.log('Editar repuesto:', repuesto);
        setModalMode('edit');
        setSelectedRepuesto(repuesto);
        setModalVisible(true);
    };

    const handleDeleteRepuesto = (repuesto) => {
        console.log('handleDeleteRepuesto llamado con:', repuesto);
        confirm({
            title: '¿Estás seguro de eliminar este repuesto?',
            icon: <ExclamationCircleOutlined />,
            content: `Repuesto: ${repuesto.nombre}`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                console.log('Confirmación aceptada, llamando a deleteRepuestoRecord con ID:', repuesto._id);
                deleteRepuestoRecord(repuesto._id);
            },
        });
    };

    const deleteRepuestoRecord = async (repuestoId) => {
        console.log('deleteRepuestoRecord llamado con ID:', repuestoId);
        try {
            const respuesta = await deleteRepuesto(repuestoId);
            console.log('Respuesta del servidor:', respuesta);
            message.success('Repuesto eliminado exitosamente');
            fetchRepuestos(); // Recargar lista
        } catch (error) {
            console.error('Error al eliminar repuesto:', error);
            message.error('Error al eliminar el repuesto');
        }
    };

    // Función para manejar envío del formulario (crear/editar)
    const handleSubmitRepuesto = async (formData) => {
        setConfirmLoading(true);
        try {
            if (modalMode === 'add') {
                // Crear nuevo repuesto
                await createRepuesto(formData);
                message.success('Repuesto creado exitosamente');
            } else {

                const repuestoId = selectedRepuesto._id;
                console.log("Actualizando repuesto con ID:", repuestoId, "Datos:", formData);
                // Actualizar repuesto existente
                await updateRepuesto(repuestoId, formData);
                message.success('Repuesto actualizado exitosamente');
            }
            setModalVisible(false);
            fetchRepuestos(); // Recargar lista
        } catch (error) {
            console.error('Error:', error);
            message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} el repuesto`);
        } finally {
            setConfirmLoading(false);
        }
    };

    // Función para cambiar el estado del repuesto (Activo/Inactivo)
    const handleToggleStatus = async (repuesto) => {
        try {
            await cambiarEstadoRepuesto(repuesto._id);
            message.success(`Estado del repuesto cambiado exitosamente`);
            fetchRepuestos(); // Recargar lista
        } catch (error) {
            console.error('Error al cambiar estado del repuesto:', error);
            message.error('Error al cambiar el estado del repuesto');
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
                    title="Repuestos"
                />
                
                <Content>
                    <div className='container-items'>
                        <SearchBar placeholder="Buscar repuesto..." onSearch={setSearchTerm}/>
                        <Button 
                            type="primary" 
                            icon={<PlusCircleOutlined />} 
                            onClick={() => {
                                setModalMode('add');
                                setSelectedRepuesto(null);
                                setModalVisible(true);
                            }}
                            className='icon-create'
                        >
                            Crear Repuesto
                        </Button>
                    </div>
                    
                    <DataTable 
                        columns={columns}
                        dataSource={filteredRepuestos}
                        loading={loading}
                        fetchData={fetchRepuestos}
                        onView={handleViewRepuesto}
                        onEdit={handleEditRepuesto}
                        onDelete={handleDeleteRepuesto}
                        onToggleStatus={handleToggleStatus}
                        showToggleStatus={true}
                    />
                </Content>
            </Layout>
            
            {/* Modal para crear/editar repuesto */}
            <RepuestoModalForm
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onSubmit={handleSubmitRepuesto}
                initialValues={selectedRepuesto}
                confirmLoading={confirmLoading}
                mode={modalMode}
                categorias={categorias}
                marcas={marcas}
                repuestos={repuestos}
            />
        </Layout>
    );
};

export default RepuestosPage;