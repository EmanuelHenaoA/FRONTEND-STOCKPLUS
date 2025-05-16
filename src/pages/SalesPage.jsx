import React, { useState, useEffect } from 'react';
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, FilePdfOutlined, FileExcelOutlined} from '@ant-design/icons';
import { Layout, message, Modal, Button, Form, Table, Typography } from 'antd';
import { HeaderComponent } from "../components/HeaderComponent";
import { Logo } from '../components/Logo';
import { MenuList } from '../components/MenuList';
import SearchBar from '../components/Searchbar';
import DataTable from '../components/DataTable';
import VentaFormModal from '../components/modals/SalesModalForm';
import { createSale, updateSale, deleteSale, cambiarEstadoVenta } from '../services/salesService';
import { getRepuestosActivos, getRepuestosCategoria } from '../services/repuestosService';
import api from '../services/axiosConfig';
import { exportToExcel, exportToPDF, prepareVentasForExport } from '../services/exportService';
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;
const { Title, Text } = Typography;

export const SalesPage = () => {
    const { Sider, Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sales, setSales] = useState([]);
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Crear instancia del formulario
    
    // Estados para los modales
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [selectedSale, setSelectedSale] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [categorias, setCategorias] = useState([]); // Nuevo estado para categorías
    const [currentCategoriaId, setCurrentCategoriaId] = useState(null); // Para seguimiento de filtro actual
    const [changingStatusId, setChangingStatusId] = useState(null);

    const columns = [
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
        title: 'Cliente',
        dataIndex: 'clienteNombre',
        key: 'clienteNombre',
        searchable: true
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
        render: (total) => `$${total.toLocaleString('es-ES')}`
      },
      {
        title: 'Última Actualización',
        dataIndex: 'updatedAt',
        key: 'updateddAt',
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
                background: estado === 'Completada' ? 'green' : 'red',
                padding: '8px',
                borderRadius: '10px',
            }}>
                {estado}
            </span>
        ) 
      },
    ];
      
    // Función para cargar los datos
    const fetchSales = async () => {
        setLoading(true);
        try {
          const response = await api.get('/ventas');
          console.log('Respuesta API:', response.data);
          
          if (response.data && response.data.ventas) {
            setSales(response.data.ventas);
          } else if (Array.isArray(response.data)) {
            setSales(response.data);
          } else {
            console.error('Formato de respuesta inesperado:', response.data);
            setSales([]);
          }
        } catch (error) {
          console.error('Error al cargar ventas:', error);
          message.error('Error al cargar las ventas');
          setSales([]);
          
          if (error.response && error.response.status === 401) {
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
    };

    // Modificación del useEffect para fetchSales
    useEffect(() => {
      const loadSales = async () => {
          await fetchSales();
          console.log("Estado de sales después de cargar (async):", sales);
      };
      loadSales();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Agregar este useEffect para monitorear cambios en el estado de sales
    useEffect(() => {
      console.log("Sales actualizado:", sales);
      if (sales.length > 0 && sales[0].idCliente) {
          console.log("Primer cliente en sales:", sales[0].idCliente);
      }
    }, [sales]);
      
    // Función para cargar clientes
    const fetchClientes = async () => {
        try {
            const response = await api.get('/clientes');
            if (response.data && response.data.clientes) {
                setClientes(response.data.clientes);
            } else if (Array.isArray(response.data)) {
                setClientes(response.data);
            } else {
                const arrayData = Object.values(response.data).find(item => Array.isArray(item));
                if (arrayData) {
                    setClientes(arrayData);
                }
            }
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    };

    const fetchRepuestosActivos = async () => {
      try {
          const data = await getRepuestosActivos();
          if (data && data.repuestos) {
              setRepuestos(data.repuestos);
          } else {
              console.error('Formato de respuesta inesperado en repuestos activos:', data);
              setRepuestos([]);
          }
      } catch (error) {
          console.error('Error al cargar repuestos activos:', error);
          message.error('Error al cargar los repuestos activos');
      }
    };

   // Nueva función para cargar repuestos por categoría
   const fetchRepuestosPorCategoria = async (categoriaId) => {
    setCurrentCategoriaId(categoriaId);
    try {
        const data = await getRepuestosCategoria(categoriaId);
        if (data && data.repuestos) {
            setRepuestos(data.repuestos);
        } else {
            console.error('Formato de respuesta inesperado en repuestos por categoría:', data);
            setRepuestos([]);
        }
      } catch (error) {
          console.error(`Error al cargar repuestos para categoría ${categoriaId}:`, error);
          message.error('Error al cargar los repuestos por categoría');
      }
    };

       // Manejador de cambio de categoría
       const handleCategoriaChange = (categoriaId) => {
        if (categoriaId) {
            fetchRepuestosPorCategoria(categoriaId);
        } else {
            fetchRepuestosActivos(); // Si no hay categoría, mostrar todos los activos
        }
    };

    // Función para cargar categorías
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

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchClientes();
        fetchRepuestosActivos(); // Cambiamos para usar repuestos activos
        fetchCategorias(); // Agregamos carga de categorías
    }, []);

    useEffect(() => {
      // Refrescar datos de repuestos cuando se abre el modal
      if (modalVisible) {
        fetchRepuestosActivos();
      }
    }, [modalVisible]);

    // Función para obtener el nombre del repuesto por ID
    const getRepuestoNombre = (repuestoId) => {
        if (!repuestos || repuestos.length === 0) return 'Repuesto no encontrado';
        const repuesto = repuestos.find(r => r._id === repuestoId);
        return repuesto ? repuesto.nombre : 'Este repuesto está inactivo';
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
    const handleViewSale = (sale) => {
        console.log('Ver detalles de la venta:', sale);
        
        // Obtener los datos del cliente
        let clienteNombre = '';
        if (sale.idCliente && typeof sale.idCliente === 'object') {
            clienteNombre = sale.idCliente.nombre || sale.idCliente.razonSocial;
        } else if (clientes.length > 0) {
            const clienteEncontrado = clientes.find(c => c._id === sale.idCliente);
            clienteNombre = clienteEncontrado ? (clienteEncontrado.nombre || clienteEncontrado.razonSocial) : 'Cliente no identificado';
        } else {
            clienteNombre = 'Cliente ID: ' + sale.idCliente;
        }

        Modal.info({
            title: 'Detalles de la Venta',
            width: 700,
            content: (
                <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <Title level={5}>Información General</Title>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <Text><strong>ID:</strong> {sale._id}</Text>
                            <Text><strong>Fecha de Venta:</strong> {new Date(sale.fecha).toLocaleDateString('es-ES')}</Text>
                            <Text><strong>Cliente:</strong> {clienteNombre}</Text>
                            <Text><strong>Fecha Creación:</strong> {new Date(sale.createdAt).toLocaleString('es-ES')}</Text>
                            {sale.updatedAt && (
                              <Text><strong>Última Actualización:</strong> {new Date(sale.updatedAt).toLocaleString('es-ES')}</Text>
                            )}
                            <Text><strong>Total:</strong> ${sale.total.toLocaleString('es-ES')}</Text>
                        </div>
                    </div>
                    <Table 
                        dataSource={sale.repuestos.map((rep, index) => ({ ...rep, key: index }))} 
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

    const handleEditSale = (sale) => {
        console.log('Editar Venta:', sale);
        form.resetFields(); // Resetear el formulario antes de abrir el modal
        setModalMode('edit');
        setSelectedSale(sale);
        setModalVisible(true);
        fetchRepuestosActivos();
    };

    const handleToggleStatus = async (venta) => {
        setChangingStatusId(venta._id);
        try {
            const response = await cambiarEstadoVenta(venta._id);
            message.success(`Estado del venta cambiado a ${response.venta.estado}`);
            fetchSales()
        } catch (error) {
            console.error('Error al cambiar estado del venta:', error);
            message.error('No se puede cambiar el estado de una venta cancelada');
        } finally {
            setChangingStatusId(null);
        }
    };

    const handleDeleteSale = (sale) => {
        console.log('handleDeleteSale llamado con:', sale);
        confirm({
          title: '¿Estás seguro de querer eliminar esta venta?',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
                <p><strong>Cliente:</strong> {
                    (() => {
                      const cliente = sale.idCliente;
                      if (cliente && typeof cliente === 'object') {
                        return cliente.nombre || cliente.razonSocial || 'Cliente sin nombre';
                      }
                      
                      // Si el cliente es un ID y tenemos la lista de clientes
                      if (clientes.length > 0) {
                        const clienteEncontrado = clientes.find(c => c._id === cliente);
                        if (clienteEncontrado) {
                          return clienteEncontrado.nombre || clienteEncontrado.razonSocial;
                        }
                      }
                      
                      return 'ID: ' + cliente;
                    })()
                }</p>
                <p><strong>Fecha y Hora de Venta:</strong> {new Date(sale.fecha).toLocaleDateString('es-ES')}</p>
                <p><strong>Total:</strong> ${sale.total.toLocaleString('es-ES')}</p>
                <p><strong>Cantidad de Productos:</strong> {sale.repuestos?.length || 0}</p>
            </div>
          ),
          okText: 'Sí, eliminar',
          okType: 'danger',
          cancelText: 'Cancelar',
          onOk() {
            console.log('Confirmación aceptada, llamando a deleteSaleRecord con ID:', sale._id);
            deleteSaleRecord(sale._id);
          },
        });
    };

    const deleteSaleRecord = async (saleId) => {
        console.log('deleteSaleRecord llamado con ID:', saleId);
        try {
          const respuesta = await deleteSale(saleId);
          console.log('Respuesta del servidor:', respuesta);
          message.success('Venta eliminada exitosamente');
          // Actualizamos todos los datos para ver reflejado el cambio en el stock
          fetchSales()
        } catch (error) {
          console.error('Error al eliminar venta:', error);
          message.error('Error al eliminar la venta');
        }
    };

    // Función para manejar envío del formulario (crear/editar)
    const handleSubmitSale = async (formData) => {
        setConfirmLoading(true);
        try {
          if (modalMode === 'add') {
            // Crear nueva venta
            await createSale(formData);
            message.success('Venta creada exitosamente');
          } else {
            // Actualizar venta existente
            // Aseguramos que idVenta esté presente para el backend
            formData.idVenta = formData._id;
            await updateSale(formData._id, formData);
            message.success('Venta actualizada exitosamente');
          }
          setModalVisible(false);
          // Actualizamos todos los datos para ver reflejado el cambio en el stock
          fetchSales()
        } catch (error) {
          console.error('Error:', error);
          message.error(`Error al ${modalMode === 'add' ? 'crear' : 'actualizar'} la venta`);
        } finally {
          setConfirmLoading(false);
        }
    };

        // Función para manejar la exportación a Excel
    const handleExportToExcel = () => {
      const dataToExport = prepareVentasForExport(sales, clientes);
      exportToExcel(dataToExport, 'Ventas');
      message.success('Exportación a Excel completada');
    };

    // Función para manejar la exportación a PDF
    const handleExportToPDF = () => {
      const dataToExport = prepareVentasForExport(sales, clientes);
      // Usamos las columnas para formar la estructura del PDF
      const pdfColumns = columns.slice(0, -1); // Excluir la última columna (acciones)
      exportToPDF(dataToExport, pdfColumns, 'Ventas');
      message.success('Exportación a PDF completada');
    };

    const processedSales = sales.map(sale => {
      // Crear una nueva propiedad para el nombre del cliente
      let clienteNombre = "No disponible";
      
      if (sale.idCliente && typeof sale.idCliente === 'object') {
          clienteNombre = sale.idCliente.nombre || sale.idCliente.razonSocial || "Sin nombre";
          console.log("Encontrado cliente en objeto:", clienteNombre);
      }
      
      return {
          ...sale,
          key: sale._id, // Asegurar que cada fila tenga una key única
          clienteNombre // Agregar el nombre procesado
      };
  });

    return (
        <Layout>
          <Sider 
            collapsed={collapsed}
            collapsible
            trigger={null}
            className="sidebar"
            width={220}           // ancho cuando está expandido
            collapsedWidth={70} 
          >
            <Logo collapsed={collapsed}/>
            <MenuList className="menu-bar"/>
          </Sider>
          
          <Layout className={`main-content ${collapsed ? 'collapsed' : ''}`}>
            <HeaderComponent 
              collapsed={collapsed} 
              setCollapsed={setCollapsed}  
              title="Ventas"
            />
            
            <Content>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '35px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <SearchBar placeholder="Buscar venta..."/>
                </div>
                  <Button 
                    type="default" 
                    icon={<FilePdfOutlined />} 
                    onClick={handleExportToPDF}
                    style={{marginLeft: '10px'}}
                  >PDF
                  </Button>
                  <Button 
                  icon={<FileExcelOutlined />} 
                  onClick={handleExportToExcel}
                  style={{marginLeft: '10px'}}
                  >Excel
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                      form.resetFields(); // Resetear el formulario antes de abrir el modal
                      setModalMode('add');
                      setSelectedSale(null);
                      setModalVisible(true);
                    }}
                    style={{ backgroundColor: '#d32929', borderColor: '#d32929' }}
                  >
                    Crear Venta
                  </Button>
              </div>
              
              <DataTable 
                columns={columns}
                dataSource={processedSales}
                loading={loading}
                fetchData={fetchSales}
                onView={handleViewSale}
                onEdit={handleEditSale}
                onDelete={handleDeleteSale}
                onToggleStatus={handleToggleStatus}  // Nueva prop para manejar cambio de estado
                toggleStatusLoading={changingStatusId !== null}  // Para controlar estado de carga
                toggleStatusIdLoading={changingStatusId}  // ID del elemento cambiando estado
                showToggleStatus={true}  // Mostrar botón de cambio de estado

              />
            </Content>
          </Layout>
          
          {/* Modal para crear/editar venta */}
          <VentaFormModal
            visible={modalVisible}
            onCancel={() => {
              form.resetFields();
              setModalVisible(false);
            }}
            onSubmit={handleSubmitSale}
            initialValues={selectedSale}
            clientes={clientes}
            repuestos={repuestos}
            categorias={categorias} // Agrega esta línea para pasar las categorías
            currentCategoriaId={currentCategoriaId} // Agrega esta línea
            confirmLoading={confirmLoading}
            mode={modalMode}
            form={form}
            onCategoriaChange={handleCategoriaChange} // Agrega esta línea para pasar la función manejadora
          />
        </Layout>
    );
};

export default SalesPage;