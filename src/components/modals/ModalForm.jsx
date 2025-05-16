// src/components/modals/ModalForm.jsx
import React from 'react';
import { Modal, Button } from 'antd';
import '../../styles/Modals.css'
const ModalForm = ({ 
  title, 
  visible, 
  onCancel, 
  onOk, 
  confirmLoading, 
  children,
  width = 500
}) => {
  return (
    <Modal className='modal-form'
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={confirmLoading} 
          onClick={onOk}
          style={{ backgroundColor: '#d32929', borderColor: '#d32929' }}
        >
          Guardar
        </Button>,
      ]}
      maskClosable={false}
      width={width}
    >
      {children}
    </Modal>
  );
};

export default ModalForm;