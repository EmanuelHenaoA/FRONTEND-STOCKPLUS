import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Layout, message, Modal, Button, Form, Table, Typography, Select } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import BuysModalForm from '../components/modals/BuysModalForm';
import api from '../services/axiosConfig';
import { useNavigate } from "react-router-dom";
import { cambiarEstadoCompra } from '../services/buysService';

const { confirm } = Modal;
const { Title, Text } = Typography;

export const BuysPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [compras, setCompras] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [todosRepuestos, setTodosRepuestos] = useState([]); // Nuevo estado para todos los repuestos (activos e inactivos)
    const [categorias, setCategorias] = useState([]);
    const [changingStatusId, setChangingStatusId] = useState(null)

    const columns = [
      {
        title: 'Fecha Compra',
        dataIndex: 'fecha',
        key: 'fecha',
        render: (fecha) => new Date(fecha).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      },
      {
        title: 'Proveedor',
        dataIndex: 'proveedorNombre',
        key: 'proveedorNombre',
      },
      {
        title: 'Cantidad de Repuestos',
        dataIndex: 'repuestos',
        key: 'cantidadRepuestos',
        render: (repuestos) => repuestos?.length || 0
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (total) => `$${total.toLocaleString('es-ES',)}`
      },
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
      {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => (
          <span style={{ 
              background: estado === 'Completada' ?  '#28D4471E' : '#D329291E',
              color: estado === 'Completada' ?  '#53d447' : '#d32929' ,
              padding: '8px',
              borderRadius: '0.25rem',
              border: '1px solid'
            
          }}>
              {estado}
          </span>
      ) 
    },
    ];
      
    // Función para cargar los datos
    const fetchCompras = async () => {
        setLoading(true);
        try {
          const response = await api.get('/compras');
          console.log('Respuesta API:', response.data);
          
          if (response.data && response.data.compras) {
            setCompras(response.data.compras);
          } else if (Array.isArray(response.data)) {
            setCompras(response.data);
          } else {
            console.error('Formato de respuesta inesperado:', response.data);
            setCompras([]);
          }
        } catch (error) {
          console.error('Error al cargar compras:', error);
          message.error('Error al cargar las compras');
          setCompras([]);
          
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
    };

    // Modificación del useEffect para fetchCompras
    useEffect(() => {
      const loadCompras = async () => {
          await fetchCompras();
          console.log("Estado de compras después de cargar (async):", compras);
      };
      loadCompras();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Agregar este useEffect para monitorear cambios en el estado de compras
    useEffect(() => {
      console.log("Compras actualizado:", compras);
      if (compras.length > 0 && compras[0].idProveedor) {
          console.log("Primer proveedor en compras:", compras[0].idProveedor);
      }
    }, [compras]);
      
    // Función para cargar proveedores
    const fetchProveedores = async () => {
        try {
            const response = await api.get('/proveedores');
            if (response.data && response.data.proveedores) {
                setProveedores(response.data.proveedores);
            } else if (Array.isArray(response.data)) {
                setProveedores(response.data);
            } else {
                const arrayData = Object.values(response.data).find(item => Array.isArray(item));
                if (arrayData) {
                    setProveedores(arrayData);
                }
            }
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    };

    // Función para cargar todos los repuestos (activos e inactivos)
    const fetchTodosRepuestos = async () => {
      try {
        const response = await api.get('/repuestos');
        if (response.data && response.data.repuestos) {
          setTodosRepuestos(response.data.repuestos);
        } else if (Array.isArray(response.data)) {
          setTodosRepuestos(response.data);
        } else {
          console.error('Formato de respuesta inesperado en todos los repuestos:', response.data);
          setTodosRepuestos([]);
        }
      } catch (error) {
        console.error('Error al cargar todos los repuestos:', error);
        message.error('Error al cargar todos los repuestos');
      }
    };

    // Función para cargar solo repuestos activos
    const fetchRepuestosActivos = async () => {
      try {
        const response = await api.get('/repuestos/activos');
        if (response.data && response.data.repuestos) {
          setRepuestos(response.data.repuestos);
        } else if (Array.isArray(response.data)) {
          setRepuestos(response.data);
        } else {
          console.error('Formato de respuesta inesperado en repuestos activos:', response.data);
          setRepuestos([]);
        }
      } catch (error) {
        console.error('Error al cargar repuestos activos:', error);
        message.error('Error al cargar los repuestos activos');
      }
    };

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


    // Cargar datos al montar el componente
    useEffect(() => {
        fetchProveedores();
        fetchRepuestosActivos();
        fetchTodosRepuestos(); // Cargar todos los repuestos también
        fetchCategorias();
    }, []);

    // Función para obtener el nombre del repuesto por ID
    const getRepuestoNombre = (repuestoId) => {
        // Buscamos en TODOS los repuestos, no solo en los activos
        if (!todosRepuestos || todosRepuestos.length === 0) return 'Repuesto no encontrado';
        const repuesto = todosRepuestos.find(r => r._id === repuestoId);
        return repuesto ? repuesto.nombre : 'Repuesto no encontrado';
    };

    // Columnas para la tabla de repuestos en el modal de detalles
    const repuestosDetalleColumns = [
      {
          title: 'Repuesto',
          dataIndex: 'idRepuesto',
          key: 'repuesto',
          render: (idRepuesto) => getRepuestoNombre(idRepuesto)
      },
      {
          title: 'Cantidad',
          dataIndex: 'cantidad',
          key: 'cantidad'
      },
      {
          title: 'Valor Unitario',
          key: 'precio',
          render: (_, record) => {
              // Usar precio si existe
              const unitario = record.precio || (record.valor / record.cantidad);
              return `$${unitario.toLocaleString('es-ES')}`;
          }
      },
      {
          title: 'Subtotal',
          key: 'subtotal',
          render: (_, record) => {
              const unitario = record.precio || (record.valor / record.cantidad);
              return `$${(record.cantidad * unitario).toLocaleString('es-ES')}`;
          }
      }
    ];

    // Funciones para manejar acciones
    const handleViewCompra = (compra) => {
        console.log('Ver detalles de la compra:', compra);
        
        // Obtener los datos del proveedor
        let proveedorNombre = '';
        if (compra.idProveedor && typeof compra.idProveedor === 'object') {
            proveedorNombre = compra.idProveedor.nombre || compra.idProveedor.razonSocial;
        } else if (proveedores.length > 0) {
            const proveedorEncontrado = proveedores.find(p => p._id === compra.idProveedor);
            proveedorNombre = proveedorEncontrado ? (proveedorEncontrado.nombre || proveedorEncontrado.razonSocial) : 'Proveedor no identificado';
        } else {
            proveedorNombre = 'Proveedor ID: ' + compra.idProveedor;
        }

        Modal.info({
            title: 'Detalles de la Compra',
            width: 700,
            content: (
                <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {/* <Text><strong>ID de Compra:</strong> {compra._id}</Text> */}
                            <Text><strong>Fecha y hora de Compra:</strong> {new Date(compra.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</Text>
                            <Text><strong>Fecha Creación:</strong> {new Date(compra.createdAt).toLocaleString('es-ES')}</Text>
                            {compra.updatedAt && (
                              <Text><strong>Última Actualización:</strong> {new Date(compra.updatedAt).toLocaleString('es-ES')}</Text>
                            )}
                            <Text><strong>Proveedor:</strong> {proveedorNombre}</Text>
                            <Text><strong>Total:</strong> ${compra.total.toLocaleString('es-ES')}</Text>
                        </div>
                    </div>
                    <Table 
                        dataSource={compra.repuestos.map((rep, index) => ({ ...rep, key: index }))} 
                        columns={repuestosDetalleColumns} 
                        pagination={false}
                        size="small"
                        bordered
                    />
                </div>
            ),
            okText: 'Cerrar',
        });
    };

    const handleEditCompra = (compra) => {
        console.log('Editar Compra:', compra);
        form.resetFields(); // Resetear el formulario antes de abrir el modal
        setModalMode('edit');
        setSelectedCompra(compra);
        // Aseguramos que tengamos tanto los repuestos activos como los inactivos

        setModalVisible(true);
        ;
    };

    const handleToggleStatus = async (compra) => {
        setChangingStatusId(compra._id);
        try {
            const response = await cambiarEstadoCompra(compra._id);
            message.success(`Estado del compra cambiado a ${response.compra.estado}`);
            fetchCompras()
        } catch (error) {
            console.error('Error al cambiar estado de la compra:', error);
            message.error('Error al cambiar el estado de la compra');
        } finally {
            setChangingStatusId(null);
        }
    };

    const handleDeleteCompra = (compra) => {
        console.log('handleDeleteCompra llamado con:', compra);
        confirm({
          title: '¿Estás seguro de querer eliminar esta compra?',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
                <p><strong>Proveedor:</strong> {
                    (() => {
                      const proveedor = compra.idProveedor;
                      if (proveedor && typeof proveedor === 'object') {
                        return proveedor.nombre || proveedor.razonSocial || 'Proveedor sin nombre';
                      }
                      
                      // Si el proveedor es un ID y tenemos la lista de proveedores
                      if (proveedores.length > 0) {
                        const proveedorEncontrado = proveedores.find(p => p._id === proveedor);
                        if (proveedorEncontrado) {
                          return proveedorEncontrado.nombre || proveedorEncontrado.razonSocial;
                        }
                      }
                      
                      return 'ID: ' + proveedor;
                    })()
                }</p>
                <p><strong>Fecha y Hora de Compra:</strong> {new Date(compra.fecha).toLocaleDateString('es-ES')}</p>
                <p><strong>Total:</strong> ${compra.total.toLocaleString('es-ES')}</p>
                <p><strong>Cantidad de Productos:</strong> {compra.repuestos?.length || 0}</p>
            </div>
          ),
          okText: 'Sí, eliminar',
          okType: 'danger',
          cancelText: 'Cancelar',
          onOk() {
            console.log('Confirmación aceptada, llamando a deleteCompraRecord con ID:', compra._id);
            deleteCompraRecord(compra._id);
          },
        });
    };

    const deleteCompraRecord = async (compraId) => {
        console.log('deleteCompraRecord llamado con ID:', compraId);
        try {
          const response = await api.delete(`/compras/${compraId}`);
          console.log('Respuesta del servidor:', response.data);
          message.success('Compra eliminada exitosamente');
          // Actualizamos todos los datos para ver reflejado el cambio en el stock
          fetchCompras()
        } catch (error) {
          console.error('Error al eliminar compra:', error);
          message.error('Error al eliminar la compra');
        }
    };

    // Función para manejar envío del formulario (crear/editar)
    const handleSubmitCompra = async (formData) => {
        setConfirmLoading(true);
        try {
          if (modalMode === 'add') {
            // Crear nueva compra
            await api.post('/compras', formData);
            message.success('Compra creada exitosamente');
          } else {
            // Actualizar compra existente
            // Aseguramos que idCompra esté presente para el backend
            formData.idCompra = formData._id;
            await api.put('/compras', formData);
            message.success('Compra actualizada exitosamente');
          }
          setModalVisible(false);
          // Actualizamos todos los datos para ver reflejado el cambio en el stock
          fetchCompras()
        } catch (error) {
          console.error('Error:', error);
          message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} la compra`);
        } finally {
          setConfirmLoading(false);
        }
    };

    const processedCompras = compras.map(compra => {
      // Crear una nueva propiedad para el nombre del proveedor
      let proveedorNombre = "No disponible";
      
      if (compra.idProveedor && typeof compra.idProveedor === 'object') {
          proveedorNombre = compra.idProveedor.nombre || compra.idProveedor.razonSocial || "Sin nombre";
      } else if (proveedores.length > 0) {
          const proveedorEncontrado = proveedores.find(p => p._id === compra.idProveedor);
          proveedorNombre = proveedorEncontrado ? (proveedorEncontrado.nombre || proveedorEncontrado.razonSocial) : "Proveedor desconocido";
      }
      
      return {
          ...compra,
          key: compra._id, // Asegurar que cada fila tenga una key única
          proveedorNombre // Agregar el nombre procesado
      };
    });

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
              title="Compras"
            />
            
            <Content>
              <div className='container-items'>
                <div>
                  <SearchBar placeholder="Buscar compra..."/>
                </div>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => {
                    form.resetFields(); // Resetear el formulario antes de abrir el modal
                    setModalMode('add');
                    setSelectedCompra(null);
                    // Solo usar repuestos activos para nuevas compras
                    fetchRepuestosActivos();
                    setModalVisible(true);
                  }}
                  className='icon-create'
                >
                  Crear Compra
                </Button>
              </div>
              
              <DataTable 
                columns={columns}
                dataSource={processedCompras}
                loading={loading}
                fetchData={fetchCompras}
                onView={handleViewCompra}
                onEdit={handleEditCompra}
                onDelete={handleDeleteCompra}
                onToggleStatus={handleToggleStatus}
                toggleStatusLoading={changingStatusId !== null}  // Para controlar estado de carga
                toggleStatusIdLoading={changingStatusId}  // ID del elemento cambiando estado
                showToggleStatus={true}  // Mostrar botón de cambio de estado
              />
            </Content>
          </Layout>
          
          {/* Modal para crear/editar compra */}
          <BuysModalForm
            visible={modalVisible}
            onCancel={() => {
              form.resetFields();
              setModalVisible(false);
            }}
            onSubmit={handleSubmitCompra}
            initialValues={selectedCompra}
            proveedores={proveedores}
            repuestos={repuestos} // Usar la lista adecuada según el modo
            categorias={categorias}
            confirmLoading={confirmLoading}
            mode={modalMode}
            form={form}
          />
        </Layout>
    );
};

export default BuysPage;