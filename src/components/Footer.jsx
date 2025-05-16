import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-header">
          Si quieres obtener los mejores repuestos para tu moto, no dudes en comprarlos aquí en LapardMotor, tu almacén de confianza.
        </div>
        <div className="footer-links">
          <div className="link">
            <h5>LapardMotor</h5>
            <p>Nosotros</p>
            <p>Repuestos</p>
            <p>Información</p>
          </div>
          <div className="link">
            <h5>Contáctanos</h5>
            <p>Instagram</p>
            <p>Whatsapp</p>
            <p>Facebook</p>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>Copyright 2025, Emanuel Henao Arroyave Maria Paola Hinestroza</p>
      </div>
    </div>
  );
};

export default Footer;