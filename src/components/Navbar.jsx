import React from "react";
import "../styles/Landing.css";
import useNavigationHelpers from "../lib/helpers/navigationHelpers";

const Navbar = () => {
  const {loginForm, registerForm, catalogPage, landingPage} = useNavigationHelpers()
    const scrollToSection = () => {
    const element = document.getElementById('conoce-mas');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  return (
    <div>

    <div className="navbar">
      <a href="#" className="logo">StockPlus</a>
      <div className="nav-links">
        <span className="item selected" onClick={landingPage}>Inicio</span>
        <span id="scroll" className="item" onClick={scrollToSection}>Explorar</span>
        <span id="scroll" className="item" onClick={catalogPage}>Repuestos</span>
      </div>
      <div className="nav-buttons" id="navMenu">
        <button className="nav-btn selected" onClick={loginForm}>Iniciar sesion</button>
        <button className="info-btn nav-btn" onClick={registerForm} >Registrate</button>
      </div>
      <button className="toggler">
        <i className="bx bx-menu"></i>
      </button>
    </div>
    </div>
  );
};

export default Navbar;