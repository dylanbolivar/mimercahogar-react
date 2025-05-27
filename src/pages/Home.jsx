import React from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/principal.css";

// Importa el Navbar reutilizable
import Navbar from "../components/Navbar";

// Imágenes
import promo1 from "../assets/img/promocion11.png";
import promo2 from "../assets/img/promocion22.png";
import promo3 from "../assets/img/promocion33.png";
import promo4 from "../assets/img/promocion3.png";
import logo from "../assets/img/logo-mmhm.png";
import arroz from "../assets/img/arroz.png";
import carne from "../assets/img/carne.png";
import leche from "../assets/img/leche.png";

function Home({ carrito, setCarrito }) {
  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <>
      {/* Carrusel de imágenes */}
      <div className="container mt-4">
        <Carousel>
          {[promo1, promo2, promo3, promo4].map((img, i) => (
            <Carousel.Item key={i}>
              <img
                src={img}
                className="d-block w-100"
                alt={`Promo ${i + 1}`}
                style={{ maxHeight: "500px", objectFit: "contain" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Aside - Quiénes somos */}
      <aside className="aside container mt-5 mb-5 text-center">
        <img src={logo} alt="Logo MMH" id="logo" className="img-fluid mb-3" />

        <h3>¿Quiénes somos?</h3>
        <p id="frase" className="fst-italic">
          "Realizar tus compras nunca fue tan fácil como antes. ¿Por qué salir cuando puedes tenerlo en cuestión de minutos?"
        </p>
        <p><strong>Perfil:</strong> Somos una distribuidora de productos de almacenes reconocidos. Enviamos lo que el cliente seleccione de varios almacenes en un solo envío.</p>
        <p><strong>Ubicación:</strong> Cll 77B #100b-30</p>
        <p><strong>Nuestros Proveedores:</strong></p>
        <ul>
          <li>Éxito</li>
          <li>Alkosto</li>
          <li>D1</li>
          <li>Ara</li>
          <li>Oxxo</li>
        </ul>
        <h4>Síguenos en nuestras redes sociales</h4>
        <ul className="list-unstyled d-flex justify-content-center gap-3">
          <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        </ul>
      </aside>

      {/* Carrito de Compras */}
      <div className="container mt-4">
        <h2>Carrito de Compras</h2>
        {carrito?.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <ul className="list-group">
            {carrito.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {item.nombre}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarDelCarrito(index)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main - Productos Destacados */}
      <main>
        <div className="container mt-5">
          <h2 className="text-center">Productos Destacados</h2>
          <div className="row">
            {[{ img: arroz, nombre: "Arroz FLOR HUILA (5000 gr)", precio: 22500 },
              { img: carne, nombre: "Chuleta de Cerdo Económica", precio: 8900 },
              { img: leche, nombre: "Leche EXITO MARCA PROPIA Entera (5400 ml)", precio: 16620 }].map((prod, i) => (
              <div className="col-md-4" key={i}>
                <div className="card product-card">
                  <img src={prod.img} className="card-img-top" alt={prod.nombre} />
                  <div className="card-body">
                    <h5 className="card-title">{prod.nombre}</h5>
                    <p className="card-text">${prod.precio.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de Preguntas Frecuentes */}
        <div className="necesitas-algo-mas">
          <h2>¿Necesitas algo más?</h2>
          {[
            {
              titulo: "¿Qué medios de pago aceptan?",
              desc: "Tarjetas débito, crédito, Mastercard, Visa."
            },
            {
              titulo: "¿Cómo puedo cancelar mi pedido?",
              desc: "Si no ha sido preparado, puedes cancelarlo desde la app o llamando."
            },
            {
              titulo: "Mi tarjeta ha sido rechazada",
              desc: "Verifica si tu tarjeta está habilitada para compras online."
            },
            {
              titulo: "Confirmación de compra",
              desc: "Recibirás confirmación por correo o en la app."
            }
          ].map((faq, i) => (
            <div className="dropdown" key={i}>
              <button className="dropbtn">{faq.titulo}</button>
              <div className="dropdown-content">
                <p>{faq.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>WEBSITE LINKS</p>
        <p>Aviso de Privacidad</p>
        <p>Términos y condiciones</p>
        <p>Sobre Nosotros</p>
        <div>
          <p>Servicio al cliente</p>
          <p>Lunes a viernes 8:00 am a 6:00 pm - 5999-5998 o 800-654-786-767</p>
        </div>
        <div>
          <p>¡Contáctanos!</p>
          <p>Dylanorozco60@gmail.com</p>
          <p>Mimercahogarmarket@hotmail.com</p>
          <p>Mercasoluciones@gmail.com</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
