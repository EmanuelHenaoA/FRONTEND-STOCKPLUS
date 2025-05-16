import React from "react";
import "../styles/Landing.css";
import useNavigationHelpers from "../lib/helpers/navigationHelpers";

const Navbar = () => {
  const {loginForm, registerForm} = useNavigationHelpers()
  return (
    <div className="navbar">
      <a href="#" className="logo">StockPlus</a>
      <div className="nav-links">
        <span className="item selected">INICIO</span>
        <span id="scroll" className="item">EXPLORAR</span>
        {/* <span id="scroll" className="item">REPUESTOS</span> */}
      </div>
      <div className="nav-buttons" id="navMenu">
        <button className="nav-btn selected" onClick={registerForm}>REGISTRARSE</button>
        <button className="info-btn nav-btn" onClick={loginForm} >INGRESAR</button>
      </div>
      <button className="toggler">
        <i className="bx bx-menu"></i>
      </button>
    </div>
  );
};

export default Navbar;