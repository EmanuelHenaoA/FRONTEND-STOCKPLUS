// src/components/modals/UserModalForm.jsx
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, message, Row, Col } from 'antd';
import ModalForm from './ModalForm';
import { getRolesActivos } from '../../services/rolesService'; // Importa la función

const { Option } = Select;

const UserModalForm = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialValues, 
  confirmLoading,
  mode // 'add' o 'edit'
}) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  
  // Cargar formulario cuando cambian los valores iniciales
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form, mode]);
  
  // Cargar roles desde la API
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const data = await getRolesActivos();
        // Verifica el formato correcto de los datos
        if (Array.isArray(data)) {
          setRoles(data);
        } else if (data && typeof data === 'object') {
          // Si es un objeto, intentar encontrar el array
          const arrayData = Object.values(data).find(item => Array.isArray(item));
          if (arrayData) {
            setRoles(arrayData);
          } else {
            console.error('No se encontró un array de roles en la respuesta:', data);
            setRoles([]);
          }
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error('Error al cargar roles:', error);
        message.error('Error al cargar roles');
      } finally {
        setLoadingRoles(false);
      }
    };

    if (visible) {
      fetchRoles();
    }
  }, [visible]);

  const handleOk = async () => {
    try {
        const values = await form.validateFields();

        // 🔥 Solo enviar contraseña si el usuario la modifica
        if (!values.contraseña) {
            delete values.contraseña;
        }

        console.log("📌 Datos enviados al backend:", values);
        onSubmit(values);
    } catch {
        message.error("Por favor revisa los campos del formulario");
    }
};

  return (
    <ModalForm
      title={mode === 'add' ? 'Agregar Usuario' : 'Editar Usuario'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || {}}
      >
        <Row gutter={[16, 0]}>

        {mode === 'edit' && ( 
          <Form.Item
            name="_id"
            hidden
            >
            <Input />
          </Form.Item>
        )}
          <Form.Item
          name="_id"
          label="id"
          hidden
          >
        </Form.Item>
        <Col span={12}>
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: 'Por favor ingresa un nombre real', min: 3, max: 43 }]}
          >
          <Input placeholder="Nombre completo" />
        </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
          name="documento"
          label="Documento"
          rules={[
            { required: true, message: "Por favor ingresa un documento válido" },
            { pattern: /^[0-9]{8,10}$/, message: "El documento debe tener 8 o 10 dígitos" } // Validación con expresión regular
          ]}
          validateTrigger="onBlur"
          >
          <Input placeholder="Número de documento" />
      </Form.Item>
        </Col>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
        <Form.Item
        name="direccion"  // Usa el mismo nombre que en el backend
        label="Dirección"
        rules={[{ required: true, message: 'Por favor ingresa una direccion válida', min: 5 }]}
        >
        <Input placeholder="Dirección" />
        </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
            name="contraseña"
            label="Contraseña"
            rules={[{ required: true, message: 'Por favor ingresa una contraseña (Mínimo 6 caracteres)', min: 6}]}
            >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Por favor ingresa un email' },
            { type: 'email', message: 'Email inválido' }
          ]}
          >
          <Input placeholder="email@ejemplo.com" />
        </Form.Item>
        </Col>

        </Row>
        <Form.Item
          name="rol"
          label="Rol"
          rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
          >
          <Select placeholder="Selecciona un rol" loading={loadingRoles}>
            {roles.map(rol => (
              // Ajusta las propiedades según la estructura de tus datos
              <Option key={rol._id || rol.id} value={rol._id || rol.id}>
              {rol.nombre || rol.nombre} {/* Aquí se muestra el nombre del rol en lugar del ID */}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </ModalForm>
  );
};

export default UserModalForm;