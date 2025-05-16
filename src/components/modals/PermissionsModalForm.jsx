import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

const PermissionsModalForm = ({
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
        fecha: initialValues.fecha ? moment(initialValues.fecha) : moment(),
        
      });
    } else if (visible) {
      // Si es un nuevo permiso, limpiar el formulario
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
      title={mode === 'add' ? 'Crear Nuevo Permiso' : 'Editar Permiso'}
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
          style={{ backgroundColor: '#d32929', borderColor: '#d32929' }}
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
            { required: true, message: 'Por favor ingrese el nombre del permiso' },
            { max: 50, message: 'El nombre no puede exceder los 50 caracteres' }
          ]}
        >
          <Input placeholder="Nombre del permiso" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionsModalForm;