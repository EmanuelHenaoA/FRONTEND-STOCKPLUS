import React from "react";
import useNavigationHelpers from "../lib/helpers/navigationHelpers";
import "../styles/Landing.css";
import FotoKtm from "../assets/images/FotoLogin.jpg"


const LandingContent = () => {
  const {loginForm, registerForm} = useNavigationHelpers()


  return (
    <div>
      {/* Top Container */}
      <div className="top-container">
        <div className="info-box">
          <p className="header-landing">¡Bienvenido a StockPlus!</p>
          <p className="info-text">
            Crea una cuenta para explorar y tener una maravillosa experiencia con nuestro almacen de repuestos de motos,
            o si ya tienes una, ingresa aquí:
          </p>
          <div className="info-buttons">
            <button className="info-btn selected" onClick={loginForm}>Iniciar Sesión</button>
            <button className="info-btn nav-btn" onClick={registerForm}>Crear Una Cuenta</button>
          </div>
        </div>
        <div className="nft-box">
          <img src={FotoKtm} alt="Motor" className="nft-pic"/>
        </div>
      </div>

      {/* Get Started */}
      <div className="get-started">
        <p className="header-landing">Conoce Más Sobre Nosotros</p>
        <p className="info-text">Somos un almacen de repuestos de motos que ofrece y garantiza la mejor calidad en cada uno de nuestros productos, sin excepcion alguna! Tu moto estará agradecida despues de confiar en nosotros, No esperes más!</p>
        <div className="items-box">
          <div className="item-container">
            <div className="item"><i className="bx bx-check-shield"></i></div>
            <p>Más de 10 años de experiencia</p>
          </div>
          <div className="item-container">
            <div className="item"><i className="bx bxs-hand"></i></div>
            <p>Repuestos Originales</p>
          </div>
          <div className="item-container">
            <div className="item"><i className="bx bx-check"></i></div>
            <p>Calidad Garantizada</p>
          </div>
          <div className="item-container">
            <div className="item"><i className="bx bx-dollar"></i></div>
            <p>Asegura tu inversión</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingContent;