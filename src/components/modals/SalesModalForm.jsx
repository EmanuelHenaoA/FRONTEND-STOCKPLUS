import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Select, Button, Table, InputNumber, Space, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';

const { Text } = Typography;
const { Option } = Select;

const SalesModalForm = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialValues, 
  clientes, 
  repuestos, 
  categorias, 
  confirmLoading, 
  mode,
  form,
}) => {
  const [ventaRepuestos, setVentaRepuestos] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedCategorias, setSelectedCategorias] = useState({}); // Para seguimiento de categorías seleccionadas por fila

  // Limpieza y configuración inicial
  useEffect(() => {
    if (visible) {
      if (initialValues && initialValues.repuestos) {
        // Procesamos los repuestos para asegurar que el valor unitario sea correcto
        const repuestosCorregidos = initialValues.repuestos.map(item => {
          // Copia del objeto para no modificar el original
          const repuestoCorregido = { ...item };
          
          // Si tenemos cantidad, calculamos el valor unitario real
          if (repuestoCorregido.cantidad && repuestoCorregido.cantidad > 0) {
            // Verificamos si el valor total está guardado en lugar del unitario
            if (repuestoCorregido.valor && typeof repuestoCorregido.valor === 'number') {
              // Ajustamos el valor para que sea unitario
              // Solo si el valor parece ser el total (mayor que el valor que debería tener)
              if (repuestos && repuestoCorregido.idRepuesto) {
                const repuestoActual = repuestos.find(r => r._id === repuestoCorregido.idRepuesto);
                if (repuestoActual && repuestoCorregido.valor > repuestoActual.precioVenta) {
                  repuestoCorregido.valor = repuestoCorregido.valor / repuestoCorregido.cantidad;
                }
              }
            }
          }
          
          // Aseguramos que tenga una key única
          repuestoCorregido.key = item._id || item.idRepuesto || Date.now() + Math.random();
          
          // Si ya tiene una categoría, la registramos para la interfaz
          if (repuestoCorregido.idRepuesto && repuestos) {
            const repuestoActual = repuestos.find(r => r._id === repuestoCorregido.idRepuesto);
            if (repuestoActual && repuestoActual.idCategoria) {
              const categoriaId = typeof repuestoActual.idCategoria === 'object' 
                ? repuestoActual.idCategoria._id 
                : repuestoActual.idCategoria;
              
              setSelectedCategorias(prev => ({
                ...prev,
                [repuestoCorregido.key]: categoriaId
              }));
            }
          }
          
          return repuestoCorregido;
        });
        
        setVentaRepuestos(repuestosCorregidos);
        calcularTotal(repuestosCorregidos);
        
        // Configurar el valor inicial para el cliente y la fecha
        form.setFieldsValue({
          idCliente: initialValues.idCliente && typeof initialValues.idCliente === 'object' 
            ? initialValues.idCliente._id 
            : initialValues.idCliente,
          fecha: initialValues.fecha ? moment(initialValues.fecha) : moment(),
          total: initialValues.total || 0
        });
      } else {
        setVentaRepuestos([]);
        setSelectedCategorias({});
        setTotal(0);
        form.setFieldsValue({
          fecha: moment(),
          total: 0
        });
      }
    }
  }, [visible, initialValues, form, repuestos]);

  const calcularTotal = (items) => {
    let suma = 0;
    items.forEach(item => {
      suma += (item.cantidad || 0) * (item.valor || 0);
    });
    setTotal(suma);
    form.setFieldsValue({ total: suma });
  };

  const handleAddRepuesto = () => {
    const newRepuesto = {
      key: Date.now() + Math.random(), // Clave temporal para React
      idRepuesto: null,
      cantidad: 1,
      valor: 0,
      categoriaId: null, // Agregamos campo para categoría
    };
    const newRepuestos = [...ventaRepuestos, newRepuesto];
    setVentaRepuestos(newRepuestos);
  };

  const handleRemoveRepuesto = (key) => {
    const newRepuestos = ventaRepuestos.filter(item => item.key !== key);
    setVentaRepuestos(newRepuestos);
    calcularTotal(newRepuestos);
    
    // Limpiamos la categoría seleccionada para esta fila
    const newSelectedCategorias = { ...selectedCategorias };
    delete newSelectedCategorias[key];
    setSelectedCategorias(newSelectedCategorias);
  };

  const handleCategoriaChange = (key, categoriaId) => {
    // Actualizamos el registro de categorías seleccionadas
    const newSelectedCategorias = { ...selectedCategorias, [key]: categoriaId };
    setSelectedCategorias(newSelectedCategorias);
    
    
    // Limpiamos el repuesto seleccionado para esta fila
    const newRepuestos = ventaRepuestos.map(item => {
      if (item.key === key) {
        return { ...item, idRepuesto: null, categoriaId };
      }
      return item;
    });
    
    setVentaRepuestos(newRepuestos);
    calcularTotal(newRepuestos);
  };

  const handleRepuestoChange = (key, field, value) => {
    const newRepuestos = ventaRepuestos.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        
        // Si se cambia el repuesto, actualizar el precio
        if (field === 'idRepuesto' && repuestos) {
          const repuestoSeleccionado = repuestos.find(r => r._id === value);
          if (repuestoSeleccionado) {
            updatedItem.valor = repuestoSeleccionado.precioVenta || 0;
          }
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setVentaRepuestos(newRepuestos);
    calcularTotal(newRepuestos);
  };

  // Add this function right after the handleRepuestoChange function
  const isRepuestoYaAgregado = (repuestoId) => {
    return ventaRepuestos.some(item => item.idRepuesto === repuestoId);
  };

  const repuestosColumns = [
    {
      title: 'Categoría',
      dataIndex: 'categoriaId',
      key: 'categoriaId',
      width: '25%',
      render: (value, record) => (
        <Select
          style={{ width: '100%' }}
          value={selectedCategorias[record.key] || value}
          onChange={(val) => handleCategoriaChange(record.key, val)}
          placeholder="Seleccionar categoría"
        >
          {categorias?.map(categoria => (
            <Option key={categoria._id} value={categoria._id}>
              {categoria.nombre}
            </Option>
          ))}
        </Select>
      )
    },
{
  title: 'Repuesto',
  dataIndex: 'idRepuesto',
  key: 'idRepuesto',
  width: '30%',
  render: (value, record) => (
    <Select
      style={{ width: '100%' }}
      value={value}
      onChange={(val) => handleRepuestoChange(record.key, 'idRepuesto', val)}
      placeholder="Seleccionar repuesto"
      disabled={!selectedCategorias[record.key]} // Deshabilitar hasta que se elija categoría
    >
      {repuestos?.filter(repuesto => 
        // Mostrar repuestos que coincidan con la categoría seleccionada y no estén ya agregados
        (!selectedCategorias[record.key] || 
        (repuesto.idCategoria && typeof repuesto.idCategoria === 'object' && 
        repuesto.idCategoria._id === selectedCategorias[record.key]) ||
        (typeof repuesto.idCategoria === 'string' && 
        repuesto.idCategoria === selectedCategorias[record.key])) &&
        // Excluir repuestos ya agregados a menos que sea el repuesto actual de esta fila
        (!isRepuestoYaAgregado(repuesto._id) || repuesto._id === value)
      ).map(repuesto => (
        <Option key={repuesto._id} value={repuesto._id}>
          {repuesto.nombre} - Stock: {repuesto.existencias || repuesto.stock || 0}
        </Option>
      ))}
    </Select>
      )
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      width: '15%',
      render: (value, record) => (
        <InputNumber
          min={1}
          value={value}
          onChange={(val) => handleRepuestoChange(record.key, 'cantidad', val)}
        />
      )
    },
    {
      title: 'Valor Unitario',
      dataIndex: 'valor',
      key: 'valor',
      width: '15%',
      render: (value, record) => (
        <InputNumber
          min={0}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          value={value}
          onChange={(val) => handleRepuestoChange(record.key, 'valor', val)}
          readOnly
        />
      )
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: '15%',
      render: (_, record) => `$${((record.cantidad || 0) * (record.valor || 0)).toLocaleString('es-ES')}`
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRepuesto(record.key)}
        />
      )
    }
  ];

  const handleFinish = (values) => {
    // Preparar los datos para enviar al servidor
    const formData = {
      ...values,
      fecha: values.fecha.toISOString(),
      repuestos: ventaRepuestos
        .filter(item => item.idRepuesto) // Solo incluir repuestos seleccionados
        .map(item => {
          // Asegurarnos de incluir solo las propiedades necesarias
          return {
            idRepuesto: item.idRepuesto,
            cantidad: item.cantidad || 0,
            valor: item.valor || 0
          };
        })
    };
    
    if (initialValues && initialValues._id) {
      formData._id = initialValues._id;
      // Para la actualización, usamos idVenta en vez de _id según tu controlador backend
      formData.idVenta = initialValues._id;
    }
    
    console.log("Datos a enviar:", formData);
    onSubmit(formData);
  };

  return (
    <Modal
      open={visible}
      title={mode === 'add' ? 'Crear Nueva Venta' : 'Editar Venta'}
      onCancel={onCancel}
      width={1000} // Ampliamos el ancho para acomodar la nueva columna
      confirmLoading={confirmLoading}
      onOk={() => form.submit()}
      okText={mode === 'add' ? 'Crear' : 'Actualizar'}
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Form.Item
              name="fecha"
              label="Fecha"
              rules={[{ required: true, message: 'Por favor seleccione la fecha' }]}
              style={{ width: '48%' }}
            >
              <DatePicker 
                style={{ width: '180%' }} 
                format="DD/MM/YYYY" 
                disabledDate={(current) => {
                  return current && current.isAfter(moment(), "day");
                }}
              />
            </Form.Item>
              
            <PlusOutlined onc/>
            <Form.Item
              name="idCliente"
              label="Cliente"
              rules={[{ required: true, message: 'Por favor seleccione el cliente' }]}
              style={{ width: '100%' }}
            >
              <Select
                placeholder="Seleccionar cliente"
                showSearch
                optionFilterProp="children"
              >
                {clientes?.map(cliente => (
                  <Option key={cliente._id} value={cliente._id}>
                    {cliente.nombre || cliente.razonSocial || cliente._id}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Space>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <Text strong>Repuestos</Text>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddRepuesto}
                className="custom-submit-btn" // Agrega esta clase
              >
                Agregar Repuesto
              </Button>
            </div>
            
            <Table
              dataSource={ventaRepuestos}
              columns={repuestosColumns}
              pagination={false}
              size="small"
              rowKey="key"
              scroll={{ x: 'max-content' }} // Para tablas muy anchas
            />
            
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Text strong style={{ fontSize: '16px' }}>
                Total: ${total.toLocaleString('es-ES')}
              </Text>
              <Form.Item name="total" hidden>
                <InputNumber />
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
    </Modal>
  );
};

export default SalesModalForm;