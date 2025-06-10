import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Button, Row, Col, Spin, Collapse } from 'antd';
import { getPermisos } from '../../services/permissionsService';
import { message } from 'antd';

const { Panel } = Collapse;

const RolesModalForm = ({ visible, onCancel, onSubmit, initialValues, confirmLoading, mode, form }) => {
    const [selectedPermisos, setSelectedPermisos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [permisosAgrupados, setPermisosAgrupados] = useState({});
  
    // Cargar permisos cuando se abre el modal
      useEffect(() => {
        const fetchPermisos = async () => {
          setLoading(true);
          try {
            const data = await getPermisos();
            // Ya no hacer setPermisos(data);
            
            // Agrupar permisos por módulo directamente
            const grupos = agruparPermisosPorModulo(data);
            setPermisosAgrupados(grupos);
          } catch (error) {
            console.error('Error al cargar permisos:', error);
            message.error('Error al cargar los permisos');
          } finally {
            setLoading(false);
          }
        };
  
      if (visible) {
        fetchPermisos();
      }
    }, [visible]);
  
    // Función para agrupar permisos por módulo basado en el nombre del permiso
    const agruparPermisosPorModulo = (permisos) => {
      const modulos = {
        'Roles': [],
        'Permisos': [],
        'Usuarios': [],
        'Compras': [],
        'Ventas': [],
        'Clientes': [],
        'Proveedores': [],
        'Marcas': [],
        'Categorias': [],
        'Repuestos': [],
        'Otros': [] // Para permisos que no coincidan con ningún módulo
      };

      permisos.forEach(permiso => {
        const nombre = permiso.nombre.toLowerCase();
        
        if (nombre.includes('rol')) {
          modulos['Roles'].push(permiso);
        } else if (nombre.includes('permiso')) {
          modulos['Permisos'].push(permiso);
        } else if (nombre.includes('usuario')) {
          modulos['Usuarios'].push(permiso);
        } else if (nombre.includes('compra')) {
          modulos['Compras'].push(permiso);
        } else if (nombre.includes('venta')) {
          modulos['Ventas'].push(permiso);
        } else if (nombre.includes('cliente')) {
          modulos['Clientes'].push(permiso);
        } else if (nombre.includes('proveedor')) {
          modulos['Proveedores'].push(permiso);
        } else if (nombre.includes('marca')) {
          modulos['Marcas'].push(permiso);
        } else if (nombre.includes('categoria')) {
          modulos['Categorias'].push(permiso);
        } else if (nombre.includes('repuesto')) {
          modulos['Repuestos'].push(permiso);
        } else {
          modulos['Otros'].push(permiso);
        }
      });

      // Eliminar módulos vacíos
      Object.keys(modulos).forEach(key => {
        if (modulos[key].length === 0) {
          delete modulos[key];
        }
      });

      return modulos;
    };
  
    // Establecer valores iniciales al editar
    useEffect(() => {
      if (initialValues && visible) {
        form.setFieldsValue({
          nombre: initialValues.nombre || '',
        });
        
        // Verificar si permisos existe y es un array
        if (initialValues.permisos && Array.isArray(initialValues.permisos)) {
          // Manejar ambos casos: array de IDs o array de objetos
          const permisosIds = initialValues.permisos.map(p => 
            typeof p === 'string' ? p : p._id || p.id
          );
          setSelectedPermisos(permisosIds);
        } else {
          setSelectedPermisos([]);
        }
      } else {
        form.resetFields();
        setSelectedPermisos([]);
      }
    }, [initialValues, visible, form]);
  
    const handlePermisosChange = (permisoId, checked) => {
      if (checked) {
        setSelectedPermisos(prev => [...prev, permisoId]);
      } else {
        setSelectedPermisos(prev => prev.filter(id => id !== permisoId));
      }
    };

    // Seleccionar/deseleccionar todos los permisos de un módulo
    const handleToggleModulo = (modulo, checked) => {
      const permisosDelModulo = permisosAgrupados[modulo].map(p => p._id);
      
      if (checked) {
        // Agregar todos los permisos del módulo que no estén ya seleccionados
        const nuevosPermisos = [...selectedPermisos];
        permisosDelModulo.forEach(id => {
          if (!nuevosPermisos.includes(id)) {
            nuevosPermisos.push(id);
          }
        });
        setSelectedPermisos(nuevosPermisos);
      } else {
        // Quitar todos los permisos del módulo
        setSelectedPermisos(prev => prev.filter(id => !permisosDelModulo.includes(id)));
      }
    };

    // Verificar si todos los permisos de un módulo están seleccionados
    const isModuloCompleto = (modulo) => {
      if (!permisosAgrupados[modulo]) return false;
      return permisosAgrupados[modulo].every(permiso => selectedPermisos.includes(permiso._id));
    };

    // Verificar si algunos permisos del módulo están seleccionados
    const isModuloParcial = (modulo) => {
      if (!permisosAgrupados[modulo]) return false;
      return permisosAgrupados[modulo].some(permiso => selectedPermisos.includes(permiso._id)) && 
             !isModuloCompleto(modulo);
    };
  
    const handleFinish = (values) => {
      // Validar que al menos un permiso esté seleccionado
      if (selectedPermisos.length === 0) {
        message.error('Debe seleccionar al menos un permiso');
        return;
      }
  
      // Combinar valores del formulario con permisos seleccionados
      const formData = {
        ...values,
        permisos: selectedPermisos
      };
      
      if (initialValues && initialValues._id) {
        formData._id = initialValues._id;
      }
      
      onSubmit(formData);
    };
  
    return (
      <Modal
        open={visible}
        title={mode === 'add' ? 'Crear Nuevo Rol' : 'Editar Rol'}
        onCancel={onCancel}
        width={700}
        confirmLoading={confirmLoading}
        onOk={() => form.submit()}
        okText={mode === 'add' ? 'Crear' : 'Actualizar'}
        cancelText="Cancelar"
        okButtonProps={{className: "custom-submit-btn"}}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            name="nombre"
            label="Nombre del Rol"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del rol' }]}
          >
            <Input placeholder="Nombre del rol" />
          </Form.Item>
  
          <Form.Item 
            label="Permisos"
            required
            rules={[
              {
                validator: () => {
                  if (selectedPermisos.length === 0) {
                    return Promise.reject('Debe seleccionar al menos un permiso');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Row gutter={[16, 16]}>
                  {/* Dividir los módulos en dos columnas */}
                  {Object.keys(permisosAgrupados).map((modulo, index) => (
                    <Col span={12} key={modulo}>
                      <Collapse 
                        defaultActiveKey={index === 0 ? [modulo] : []} 
                        expandIconPosition="start"
                        style={{ marginBottom: '8px' }}
                      >
                        <Panel 
                          key={modulo} 
                          header={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Checkbox
                                checked={isModuloCompleto(modulo)}
                                indeterminate={isModuloParcial(modulo)}
                                onChange={(e) => handleToggleModulo(modulo, e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                                
                              />
                              <span style={{ marginLeft: '8px' }}>{modulo}</span>
                              
                            </div>
                          }
                        >
                          <Row gutter={[8, 8]}>
                            {permisosAgrupados[modulo].map(permiso => (
                              <Col span={24} key={permiso._id}>
                                <Checkbox
                                  checked={selectedPermisos.includes(permiso._id)}
                                  onChange={(e) => handlePermisosChange(permiso._id, e.target.checked)}
                                >
                                  {permiso.nombre}
                                </Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Panel>
                      </Collapse>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  };

export default RolesModalForm;
