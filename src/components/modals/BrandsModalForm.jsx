import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';

const BrandsModalForm = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialValues, 
  confirmLoading, 
  mode,
  form
}) => {
  // Configurar el formulario cuando cambian los valores iniciales o la visibilidad
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        nombre: initialValues.nombre,
      });
    } else if (visible) {
      // Si es un nuevo cliente, limpiar el formulario
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values) => {
    // Si estamos editando, añadir el ID al objeto de datos
    if (mode === 'edit' && initialValues && initialValues._id) {
      values._id = initialValues._id;
    }
    
    console.log("Datos a enviar:", values);
    onSubmit(values);
  };


  return (
    <Modal
      open={visible}
      title={mode === 'add' ? 'Crear Nueva Marca' : 'Editar Marca'}
      onCancel={onCancel}
      width={500}
      confirmLoading={confirmLoading}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={confirmLoading} 
          onClick={() => form.submit()}
          className="custom-submit-btn" // Agrega esta clase
        >
          {mode === 'add' ? 'Crear' : 'Actualizar'}
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[
            { required: true, message: 'Por favor ingrese el nombre de la marca' },
            { max: 50, message: 'El nombre no puede exceder los 50 caracteres' }
          ]}
        >
          <Input placeholder="Nombre de la marca" />
        </Form.Item>
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
    </Modal>
  );
};

export default BrandsModalForm;