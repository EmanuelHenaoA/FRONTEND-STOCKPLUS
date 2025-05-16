import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import FormItem from 'antd/es/form/FormItem';

const ProvidersModalForm = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    confirmLoading,
    mode,
    form
}) => {
    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                nombre: initialValues.nombre,
                telefono: initialValues.telefono,
                email: initialValues.email
            });
        }else if (visible) {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleFinish = (values) => {
        if (mode === 'edit' && initialValues && initialValues._id) {
            values._id = initialValues._id;
        }

        console.log("Datos a enviar:", values);
        onSubmit(values);
    };
    
    return (
        <Modal
        open={visible}
        title={mode === 'add' ? 'Crear Nuevo Proveedor' : 'Editar Proveedor'}
        onCancel={onCancel}
        width={500}
        confirmLoading={confirmLoading}
        footer={[
            <Button key="back" onClick={onCancel}>
                Cancelar
            </Button>,
            <Button key="submit"
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
                layout='vertical'
                onFinish={handleFinish}
            >
            <FormItem
             name="nombre"
             label="Nombre"
             rules={[
                { required: true, message: 'Por favor ingrese el nombre del proveedor' },
                { max: 50, message: 'El nombre no puede exceder los 50 caracteres' }
              ]}
            >
                <Input placeholder='Nombre del proveedor'/>
            </FormItem>

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
                        { max: 100, message: 'El email no puede exceder los 100 caracteres' }
                      ]}
                    >
                      <Input placeholder="Email del cliente" type="email" />
                    </Form.Item>
            </Form>
        
        </Modal>
    );
};

export default ProvidersModalForm;