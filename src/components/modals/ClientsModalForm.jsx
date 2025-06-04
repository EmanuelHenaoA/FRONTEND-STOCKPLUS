import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const ClientsModalForm = ({ 
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
        telefono: initialValues.telefono,
        email: initialValues.email
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

  // Validación para el correo electrónico
  const validateEmail = (_, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return Promise.reject(new Error('Ingrese un correo electrónico válido'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      open={visible}
      title={mode === 'add' ? 'Crear Nuevo Cliente' : 'Editar Cliente'}
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
            { required: true, message: 'Por favor ingrese el nombre del cliente' },
            { max: 50, message: 'El nombre no puede exceder los 50 caracteres' }
          ]}
        >
          <Input placeholder="Nombre del cliente" />
        </Form.Item>

              <Form.Item
                  name="documento"
                  label="Documento"
                  rules={[
                    { required: true, message: "Por favor ingresa un documento válido" },
                    { pattern: /^[0-9]{8,10}$/, message: "El documento debe tener entre 8 y 10 dígitos" } // Validación con expresión regular
                  ]}
                  validateTrigger="onBlur"
                  >
                  <Input placeholder="Número de documento" />
              </Form.Item>
        
        <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[
              { required: true, message: "Por favor ingresa un teléfono válido" },
              { pattern: /^[0-9]{7,10}$/, message: "El teléfono debe tener entre 7 y 10 dígitos" } //  Validación con expresión regular
            ]}
            validateTrigger="onBlur"
          >
          <Input placeholder="Número de teléfono" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Por favor ingrese el email del cliente' },
            { validator: validateEmail },
            { max: 100, message: 'El email no puede exceder los 100 caracteres' }
          ]}
        >
          <Input placeholder="Email del cliente" type="email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClientsModalForm;