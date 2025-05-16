import React, { useState } from 'react';
import '../styles/Login.css';
import { FaUser, FaArrowLeft } from "react-icons/fa";
import { enviarTokenRecuperacion } from '../services/authService';
import useNavigationHelpers from '../lib/helpers/navigationHelpers';

export const ForgotPasswordForm = () => {
  const { loginForm } = useNavigationHelpers();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    try {
      const response = await enviarTokenRecuperacion(email);
      setMsg(response.msg || "Correo de recuperación enviado");
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
          <h1>Recuperar Contraseña</h1>
          <div className={`input-box ${error ? "error" : ""}`}>
            <input
              type="email"
              placeholder="Ingresa el email de tu cuenta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" />
            {error && <p className="error-msg">{error}</p>}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar recuperación"}
          </button>
          {msg && <p style={{ textAlign: "center", marginTop: "15px", color: "#3bff57" }}>{msg}</p>}
        </form>
      </div>
    </div>
  );
};
