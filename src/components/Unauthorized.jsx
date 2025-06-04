import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="Acceso Denegado"
      subTitle="Lo sentimos, no tienes permiso para acceder a esta página."
      extra={[
        <Button type="primary" key="dashboard" onClick={() => navigate('/dashboard')}>
          Volver al Inicio
        </Button>,
      ]}
    />
  );
};

export default Unauthorized;