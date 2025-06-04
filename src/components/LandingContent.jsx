import React from "react";
import useNavigationHelpers from "../lib/helpers/navigationHelpers";
import "../styles/Landing.css";
import FotoKtm from "../assets/images/FotoKtm.jpg"
import ImagenMarca1 from "../assets/images/FotoDark.jpg"
import ImagenMarca2 from "../assets/images/FotoLanding.jpg"
import ImagenMarca3 from "../assets/images/FotoMotos.jpg"



const LandingContent = () => {
  const {loginForm, registerForm, catalogPage} = useNavigationHelpers()


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
            <button className="info-btn selected" onClick={loginForm}>Iniciar sesión</button>
            <button className="info-btn nav-btn" onClick={registerForm}>Crear una cuenta</button>
          </div>
        </div>
        <div className="nft-box">
          <img src={FotoKtm} alt="Motor" className="nft-pic"/>
        </div>
      </div>

      <div className="catalogo">
    <p>Marcas y Referencias</p>
    <div className="marcas-catalogo">
      <div className="marca-item">
        <img src={ImagenMarca1} alt="Marca 1" className="marca-img"/>
        <button className="marca-btn" onClick={catalogPage}>Ver más</button>
        <div className="marca-info">
          <h3 className="marca-titulo">Honda</h3>
          <text className="marca-descripcion">Repuestos con excelente calidad y compatibles para cualquier referencia de las motos Honda.</text>
        </div>
      </div>
      <div className="marca-item">
        <img src={ImagenMarca2} alt="Marca 2" className="marca-img"/>
        <button className="marca-btn" onClick={catalogPage}>Ver más</button>
        <div className="marca-info">
          <h3 className="marca-titulo">Yamaha</h3>
          <text className="marca-descripcion">Amplio catálogo de repuestos originales para tu moto Yamaha, la marca mas vendida en el país durante los ultimos meses.</text>
        </div>
      </div>
      <div className="marca-item">
        <img src={ImagenMarca3} alt="Marca 3" className="marca-img"/>
        <button className="marca-btn" onClick={catalogPage}>Ver más</button>
        <div className="marca-info">
          <h3 className="marca-titulo">Kawasaki</h3>
          <text id="conoce-mas" className="marca-descripcion">Disfrute y asegure su compra con cualquiera de nuestros productos de calidad para todas motocicletas Kawasaki.</text>
        </div>
      </div>
    </div>
  </div>

      {/* Get Started */}
      <div className="get-started">
        <p className="header-landing">Conoce Más Sobre Nosotros</p>
        <p className="info-text">Somos un almacen de repuestos de motos con más de 10 años de experiencia en el mercado, que ofrece y garantiza la mejor calidad en cada uno de nuestros productos, sin excepcion alguna! Tu moto estará agradecida despues de confiar en Full Motos en donde manejamos los mejores precios  del mercado. No esperes más, dale a tu moto el cuidado y la importancia que se merece y compra todos los repuestos con nosotros!</p>
        <div className="items-box">
          <div className="item-container">
            <div className="item"><i className="bx bx-check-shield"></i></div>
            <p>Más de 10 años de experiencia</p>
          </div>
          <div className="item-container">
            <div className="item"><i className="bx bxs-hand"></i></div>
            <p>Repuestos originales</p>
          </div>
          <div className="item-container">
            <div className="item"><i className="bx bx-check"></i></div>
            <p>Calidad garantizada</p>
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