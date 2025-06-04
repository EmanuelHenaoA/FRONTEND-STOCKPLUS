// src/components/modals/RepuestoModalForm.jsx
import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, message } from 'antd';
import ModalForm from './ModalForm';

const { Option } = Select;

const RepuestoModalForm = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialValues, 
  confirmLoading,
  mode, // 'add' o 'edit'
  categorias = [],
  marcas = [],
  // repuestos = [] 
  
}) => {
  const [form] = Form.useForm();

  //  // Añadir un validador personalizado para el ID del repuesto
  //  const validateIdRepuesto = (_, value) => {
  //   if (!value) return Promise.resolve();
    
  //   // Si estamos en modo añadir o el ID ha cambiado
  //   if (mode === 'add' || value !== initialValues?.idRepuesto) {
  //     // Verificar si ya existe
  //     const existe = repuestos.some(r => 
  //       r.idRepuesto === value && 
  //       (mode === 'add' || r._id !== initialValues?._id)
  //     );
      
  //     if (existe) {
  //       return Promise.reject(new Error('Este código de repuesto ya está en uso'));
  //     }
  //   }
    
  //   return Promise.resolve();
  // };
  
  // Cargar formulario cuando cambian los valores iniciales
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialValues) {
        // Para el modo edición, preparamos los valores iniciales
        const formValues = { ...initialValues };
        
        // Si 'categoria' es un objeto, extraemos el ID
        if (formValues.idCategoria && typeof formValues.idCategoria === 'object') {
          formValues.idCategoria = formValues.idCategoria._id;
        }
        
        // Si 'marca' es un objeto, extraemos el ID
        if (formValues.idMarca && typeof formValues.idMarca === 'object') {
          formValues.idMarca = formValues.idMarca._id;
        }
        
        form.setFieldsValue(formValues);
      } else {
        // Para el modo añadir, reseteamos el formulario y ponemos valores por defecto
        form.resetFields();
        form.setFieldsValue({
          idRepuesto: '',
          nombre: '',
          existencias: 0,
          precio: 0,
          precioVenta: 0,
          estado: 'Activo'
        });
      }
    }
  }, [visible, initialValues, form, mode]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("📌 Datos enviados al backend:", values);
      
      // Validación adicional de precio de venta
      if (values.precioVenta <= values.precio) {
        message.warning('El precio de venta debe ser mayor al precio de compra');
        return;
      }
      
      onSubmit(values);
    } catch {
      message.error('Por favor revisa los campos del formulario');
    }
  };

  const calcularPrecioVentaSugerido = (precio) => {
    const precioNum = parseFloat(precio || 0);
    return precioNum * 1.3;
  };

  return (
    <ModalForm
      title={mode === 'add' ? 'Agregar Repuesto' : 'Editar Repuesto'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || {}}
      >
        {mode === 'edit' && (
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
        )}

        {/* <Form.Item
          name="idRepuesto"
          label="Código del Repuesto"
          rules={[{ required: true, message: 'Por favor ingresa un código', unique: true }, {validator: validateIdRepuesto}]}
        >
          <Input placeholder="Código del repuesto" />
        </Form.Item> */}
        <Form.Item
          name="nombre"
          label="Nombre del Repuesto"
          rules={[{ required: true, message: 'Por favor ingresa un nombre', min: 3 }]}
        >
          <Input placeholder="Nombre del repuesto" />
        </Form.Item>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="existencias"
            label="Existencias"
            rules={[{ required: true, message: 'Por favor ingresa las existencias' }]}
            style={{ width: '33%' }}
          >
            <InputNumber 
              min={0} 
              placeholder="Cantidad" 
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="precio"
            label="Precio de Compra"
            rules={[{ required: true, message: 'Por favor ingresa el precio de compra' }]}
            style={{ width: '33%' }}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              precision={2}
              placeholder="Precio de compra" 
              style={{ width: '100%' }}
              onChange={(value) => {
                // Al cambiar el precio de compra, sugerir el precio de venta
                const precioVentaSugerido = calcularPrecioVentaSugerido(value);
                form.setFieldsValue({ precioVenta: precioVentaSugerido });
              }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          
          <Form.Item
            name="precioVenta"
            label="Precio de Venta"
            rules={[{ required: true, message: 'Por favor ingresa el precio de venta' }]}
            style={{ width: '33%' }}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              precision={2}
              placeholder="Precio de venta" 
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="idCategoria"
            label="Categoría"
            rules={[{ required: true, message: 'Por favor selecciona una categoría' }]}
            style={{ width: '50%' }}
          >
            <Select placeholder="Selecciona una categoría">
              {categorias.map(categoria => (
                <Option key={categoria._id || categoria.id} value={categoria._id || categoria.id}>
                  {categoria.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="idMarca"
            label="Marca"
            rules={[{ required: true, message: 'Por favor selecciona una marca' }]}
            style={{ width: '50%' }}
          >
            <Select placeholder="Selecciona una marca">
              {marcas.map(marca => (
                <Option key={marca._id || marca.id} value={marca._id || marca.id}>
                  {marca.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        
        <Form.Item
          name="estado"
          label="Estado"
          rules={[{ required: true, message: 'Por favor selecciona un estado' }]}
        >
          <Select placeholder="Selecciona un estado">
            <Option value="Activo">Activo</Option>
            <Option value="Inactivo">Inactivo</Option>
          </Select>
        </Form.Item>
      </Form>
    </ModalForm>
  );
};

export default RepuestoModalForm;