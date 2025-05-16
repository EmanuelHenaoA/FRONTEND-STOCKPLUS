import React, { useState } from 'react';
import '../styles/Login.css';
import { FaLock, FaArrowLeft } from "react-icons/fa";
import { resetearContraseña } from '../services/authService';
import useNavigationHelpers from '../lib/helpers/navigationHelpers';
import { useParams, useNavigate } from 'react-router-dom';

export const ResetPasswordForm = () => {
  const { token } = useParams(); // el token viene desde la URL
  const navigate = useNavigate();
  const {loginForm} = useNavigationHelpers()

  
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const validarContraseña = (contraseña) => {
    const errores = [];
    
    if (contraseña.length < 6) {
      errores.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (!/[A-Z]/.test(contraseña)) {
      errores.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    return errores;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    
    // Validación de campos vacíos
    if (!nuevaContraseña || !confirmar) {
      setError('Ambos campos de contraseña son obligatorios');
      return;
    }
    
    // Validación de requisitos de la contraseña
    const erroresValidacion = validarContraseña(nuevaContraseña);
    if (erroresValidacion.length > 0) {
      setError(erroresValidacion.join('. '));
      return;
    }
    
    // Validación de coincidencia
    if (nuevaContraseña !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      setLoading(true);
      const response = await resetearContraseña(token, nuevaContraseña);
      setMsg(response.msg || "Contraseña actualizada correctamente");
      setTimeout(() => {
        navigate('/login'); // redirige al login luego de éxito
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='auth-container'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <FaArrowLeft onClick={loginForm} className='back'/>
          <h1 className='logo'>StockPlus</h1>
          <h1>Reestablecer Contraseña</h1>
          <div className={`input-box ${error && (error.includes('debe tener') || error.includes('mayúscula') || !nuevaContraseña) ? "error" : ""}`}>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
            />
            <FaLock className="icon" />
          </div>
          <div className={`input-box ${error && (error.includes('no coinciden') || !confirmar) ? "error" : ""}`}>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
            <FaLock className="icon" />
            {error && <p className="error-msg">{error}</p>}
          </div>
       
          <button type="submit" disabled={loading}>
            {loading ? "Reestableciendo..." : "Cambiar Contraseña"}
          </button>
          {msg && <p style={{ textAlign: "center", marginTop: "15px", color: "#3bff57" }}>{msg}</p>}
        </form>
      </div>
    </div>
  );
};