import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Asumiendo que tienes un componente Footer
import '../styles/Cataglogo.css';
import Imagen2 from "../assets/images/MotoNaranja.jpg"
import Imagen3 from "../assets/images/LogoBmw.jpg"
import Imagen4 from "../assets/images/LogoHonda.jpg"
import Imagen5 from "../assets/images/LogoYamaha.jpg"
import Imagen6 from "../assets/images/FotoYamalube.jpg"
import Imagen7 from "../assets/images/FotoCross.jpg"
import Imagen8 from "../assets/images/MotoShaft.jpg"
import Imagen9 from "../assets/images/MotoCrf.jpg"
import Imagen10 from "../assets/images/MotoRenthal.jpg"

import useNavigationHelpers from '../lib/helpers/navigationHelpers';
// import { useState, useEffect } from 'react';
// import api from '../services/axiosConfig'; // Mismo que usas en RepuestosPage


const CatalogoPage = () => {
  const {registerForm} = useNavigationHelpers()
  //   const [repuestos, setRepuestos] = useState([]);
  // const [loading, setLoading] = useState(false);

  // // Función para cargar repuestos (máximo 15)
  // const fetchRepuestos = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await api.get('/repuestos');
  //     if (response.data && response.data.repuestos) {
  //       // Filtrar solo activos y tomar máximo 15
  //       const repuestosActivos = response.data.repuestos
  //         .filter(repuesto => repuesto.estado === 'Activo')
  //         .slice(0, 15);
  //       setRepuestos(repuestosActivos);
  //     }
  //   } catch (error) {
  //     console.error('Error al cargar repuestos:', error);
  //     setRepuestos([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchRepuestos();
  // }, []);

  return (
      <div className="main">
      <Navbar />
      <div className="catalogo-container">
        <div className="catalogo-header">
          <h1 className="catalogo-title">Nuestro Catálogo</h1>
          <p className="catalogo-subtitle">Encuentra los mejores repuestos para tu moto</p>
        </div>
        
        <div className="catalogo-grid">
          {/* Aquí van tus productos */}
          <div className="producto-card">
            <img src={Imagen4} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Llantas</h3>
              <p className="producto-precio">Michelin | Kenda | Pirelli</p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
          {/* Repite este div para más productos */}
          <div className="producto-card">
            <img src={Imagen5} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Frenos</h3>
              <p className="producto-precio">Yamaha | Honda | Ktm | Bajaj</p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
          <div className="producto-card">
            <img src={Imagen6} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Aceites</h3>
              <p className="producto-precio">Yamalube | Motul | Kixx | Castrol | Mobil</p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
             <div className="producto-card">
            <img src={Imagen10} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Kits de arrastre</h3>
              <p className="producto-precio">Yamaha | Honda | Akt | Bajaj</p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
             <div className="producto-card">
            <img src={Imagen7} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Luces</h3>
              <p className="producto-precio">Yamaha | Honda | Susuki | Bajaj</p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
             <div className="producto-card">
            <img src={Imagen8} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Retrovisores</h3>
              <p className="producto-precio">Yamaha - Honda - Kawasaki - Susuki - Akt - Bajaj</p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
             <div className="producto-card">
            <img src={Imagen2} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Carburadores</h3>
              <p className="producto-precio">Yamaha - Honda - Kawasaki - Susuki - Akt - Bajaj</p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
             <div className="producto-card">
            <img src={Imagen3} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Amortiguadores</h3>
              <p className="producto-precio">Yamaha - Honda - Kawasaki - Bajaj - Bmw</p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
          <div className="producto-card">
            <img src={Imagen9} alt="Producto" className="producto-img"/>
            <div className="producto-info">
              <h3 className="producto-nombre">Rines</h3>
              <p className="producto-precio">Yamaha - Honda - Kawasaki - Susuki </p>
              <button className="producto-btn" onClick={registerForm}>Ver detalles</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CatalogoPage;
// <div className="main">
//   <Navbar />
//   <div className="catalogo-container">
//     <div className="catalogo-header">
//       <h1 className="catalogo-title">Nuestro Catalogo</h1>
//       <p className="catalogo-subtitle">Encuentra excelente precio y calidad en todos nuestros repuestos</p>
//     </div>
    
//     <div className="catalogo-grid">
//         {loading ? (
//             <div className="loading-message">Cargando productos...</div>
//         ) : (
//             repuestos.map((repuesto) => (
//             <div key={repuesto._id} className="producto-card">
//                 <img 
//                 src={Imagen1} // Tu imagen por defecto
//                 alt={repuesto.nombre} 
//                 className="producto-img"
//                 />
//                 <div className="producto-info">
//                 <h3 className="producto-nombre">{repuesto.nombre}</h3>
//                 <p className="producto-precio">
//                     ${repuesto.precioVenta?.toLocaleString('es-ES') || '0'}
//                 </p>
//                 <p className="producto-stock">
//                     Stock: {repuesto.existencias || 0}
//                 </p>
//                 <button className="producto-btn">Ver detalles</button>
//                 </div>
//             </div>
//             ))
//         )}
//         </div>
//   </div>
//   <Footer />
// </div>