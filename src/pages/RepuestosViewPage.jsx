// RepuestosViewPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import api from '../services/axiosConfig';
import { useNavigate } from "react-router-dom";

export const RepuestosViewPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [repuestos, setRepuestos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRepuestos, setFilteredRepuestos] = useState([]);
    const navigate = useNavigate();

    // Columnas para la tabla de repuestos (solo lectura)
    const columns = [
        {
            title: 'Código',
            dataIndex: 'idRepuesto',
            render: (codigo) => (
                <span style={{ fontWeight: 'bold' }}>
                    {codigo}
                </span>
            ) 
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        // {
        //     title: 'Existencias',
        //     dataIndex: 'existencias',
        //     key: 'existencias',
        // },
        {
            title: 'Precio',
            dataIndex: 'precioVenta',
            key: 'precioVenta',
            render: (precioVenta) => `$${precioVenta.toLocaleString('es-ES')}`
        },
        // {
        //     title: "Categoría",
        //     dataIndex: "idCategoria",
        //     key: "categoria",
        //     render: (categoria) => {
        //         return categoria && categoria.nombre ? categoria.nombre : "Sin categoría";
        //     }
        // },
        {
            title: "Marca",
            dataIndex: "idMarca",
            key: "marca",
            render: (marca) => {
                return marca && marca.nombre ? marca.nombre : "Sin marca";
            }
        },
        // {
        //     title: 'Estado',
        //     dataIndex: 'estado',
        //     key: 'estado',
        //     render: (estado) => (
        //         <span style={{ 
        //             background: estado === 'Activo' ? '#28D4471E' : '#D329291E',
        //             color: estado === 'Activo' ? '#53d447' : '#d32929',
        //             padding: '8px',
        //             borderRadius: '0.25rem',
        //             border: '1px solid'
        //         }}>
        //             {estado}
        //         </span>
        //     ) 
        // },
    ];

    // Función para cargar los datos de repuestos
    const fetchRepuestos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/repuestos/activos-catalogo');
            console.log('Respuesta API:', response.data);
            
            if (response.data && response.data.repuestos) {
                // Filtrar solo repuestos activos
                const repuestosActivos = response.data.repuestos.filter(
                    repuesto => repuesto.estado === 'Activo'
                );
                setRepuestos(repuestosActivos);
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
    }, []);

    // Filtrado de repuestos
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
                (repuesto.estado && repuesto.estado.toLowerCase().includes(searchTermLower))
            );
        });
        
        setFilteredRepuestos(filtered);
    }, [searchTerm, repuestos]);

    // Función para ver detalles (solo lectura)
    const handleViewRepuesto = (repuesto) => {
        console.log('Ver detalles del repuesto:', repuesto);
        // Aquí puedes implementar un modal de solo lectura si quieres
        message.info('Función de vista disponible');
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
                    title="Catálogo de Repuestos"
                    isReadOnlyMode={true} // Prop para indicar modo solo lectura
                />
                
                <Content>
                    <div className='container-items'>
                        <SearchBar placeholder="Buscar repuesto..." onSearch={setSearchTerm}/>
                    </div>
                    
                    <DataTable 
                        columns={columns}
                        dataSource={filteredRepuestos}
                        loading={loading}
                        fetchData={fetchRepuestos}
                        onView={handleViewRepuesto}
                        // No pasamos onEdit, onDelete, onToggleStatus para que no aparezcan
                        showActions={false} // Prop para ocultar acciones si tu DataTable lo soporta
                        readOnlyMode={true} // Prop adicional para modo solo lectura
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default RepuestosViewPage;