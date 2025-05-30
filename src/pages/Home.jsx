import React, { useState, useEffect } from 'react';
import '../App.css';
import logoMercahogar from '../assets/img/logo-mmhm.png';
// Importa las imágenes de ofertas/promociones
import oferta1 from '../assets/img/promocion1.png';
import oferta2 from '../assets/img/promocion11.png';
import oferta3 from '../assets/img/promocion2.png';
import oferta4 from '../assets/img/promocion22.png';
import oferta5 from '../assets/img/promocion3.png';

import arrozImg from '../assets/img/arroz.png';
import chuletaImg from '../assets/img/carne.png';
import lecheImg from '../assets/img/leche.png';


function Home() {
    const [openFaq, setOpenFaq] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    // Array con las imágenes del carrusel
    const carouselImages = [
        oferta1,
        oferta2,
        oferta3, // ¡Agregadas aquí!
        oferta4, // ¡Agregadas aquí!
        oferta5, // ¡Agregadas aquí!
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) =>
                (prevSlide + 1) % carouselImages.length
            );
        }, 5000); // Cambia de imagen cada 5 segundos (5000 ms)

        return () => clearInterval(interval);
    }, [carouselImages.length]); // Dependencia para que el efecto se re-ejecute si cambia la cantidad de imágenes

    const toggleFaq = (key) => {
        setOpenFaq(openFaq === key ? null : key);
    };

    return (
        <div className="home-container">
            {/* Aside de información de la empresa */}
            <aside className="aside-info">
                <div className="aside-logo-container">
                    <img src={logoMercahogar} alt="Logo MiMercahogar" className="aside-logo" />
                </div>
                <h3>¿Quiénes somos?</h3>
                <p>MiMercahogar es tu aliado para hacer tus compras de mercado fácil y rápido desde la comodidad de tu hogar. ¡Ahorra tiempo y dinero!</p>
                <p>Perfil: Somos una distribuidora de productos de almacenes reconocidos. Proveemos lo que el cliente seleccione de varios almacenes en un solo envío.</p>
                <p>Ubicación: Cl 77 # 100a-30</p>
                <h4>Nuestros Proveedores:</h4>
                <ul>
                    <li>Exito</li>
                    <li>Alkosto</li>
                    <li>D1</li>
                    <li>Ara</li>
                    <li>Olímpica</li>
                </ul>
                <h4>Síguenos en nuestras redes sociales</h4>
                <p>
                    <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a> |
                    <a href="#" target="_blank" rel="noopener noreferrer"> Twitter</a> |
                    <a href="#" target="_blank" rel="noopener noreferrer"> Instagram</a>
                </p>
            </aside>

            {/* Contenido principal del Home */}
            <main className="main-content">
                <section className="offers-section">
                    <h2>Ofertas y Promociones</h2>
                    <div className="carousel-container">
                        {carouselImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Oferta ${index + 1}`}
                                className={`carousel-image ${index === currentSlide ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </section>

                <section className="featured-products">
                    <h2>Productos Destacados</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff', width: '250px' }}>
                            <img src={arrozImg} alt="Arroz Flor Huila" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                            <h3>Arroz FLOR HUILA (5000 gr)</h3>
                            <p>$22.500</p>
                            <button style={{ backgroundColor: '#ff8c00', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Agregar al Carrito</button>
                        </div>
                        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff', width: '250px' }}>
                            <img src={chuletaImg} alt="Chuleta de Cerdo" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                            <h3>Chuleta de Cerdo Económica</h3>
                            <p>$13.800</p>
                            <button style={{ backgroundColor: '#ff8c00', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Agregar al Carrito</button>
                        </div>
                         <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff', width: '250px' }}>
                            <img src={lecheImg} alt="Leche EXITO" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                            <h3>Leche EXITO MARCA PROPIA Entera (5400 ml)</h3>
                            <p>$16.670</p>
                            <button style={{ backgroundColor: '#ff8c00', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Agregar al Carrito</button>
                        </div>
                    </div>
                </section>

                {/* Sección de "Necesitas algo más?" ... */}
                <section className="faq-section">
                    <h3>¿Necesitas algo más?</h3>
                    <div className="faq-item">
                        <button className="faq-question" onClick={() => toggleFaq('pago')}>
                            ¿Qué métodos de pago aceptan?
                            <span>{openFaq === 'pago' ? '▲' : '▼'}</span>
                        </button>
                        {openFaq === 'pago' && (
                            <div className="faq-answer">
                                <p>Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express) y pagos en efectivo al momento de la entrega.</p>
                            </div>
                        )}
                    </div>
                    <div className="faq-item">
                        <button className="faq-question" onClick={() => toggleFaq('cancelar')}>
                            ¿Cómo puedo cancelar mi pedido?
                            <span>{openFaq === 'cancelar' ? '▲' : '▼'}</span>
                        </button>
                        {openFaq === 'cancelar' && (
                            <div className="faq-answer">
                                <p>Si tu pedido no ha sido preparado, puedes cancelarlo desde la app o llamando a nuestra línea de atención al cliente.</p>
                            </div>
                        )}
                    </div>
                    <div className="faq-item">
                        <button className="faq-question" onClick={() => toggleFaq('tarjeta')}>
                            Mi tarjeta ha sido rechazada.
                            <span>{openFaq === 'tarjeta' ? '▲' : '▼'}</span>
                        </button>
                        {openFaq === 'tarjeta' && (
                            <div className="faq-answer">
                                <p>Por favor, verifica los datos de tu tarjeta o contacta a tu banco. Asegúrate de que tu tarjeta está habilitada para compras online.</p>
                            </div>
                        )}
                    </div>
                     <div className="faq-item">
                        <button className="faq-question" onClick={() => toggleFaq('confirmacion')}>
                            Confirmación de compra
                            <span>{openFaq === 'confirmacion' ? '▲' : '▼'}</span>
                        </button>
                        {openFaq === 'confirmacion' && (
                            <div className="faq-answer">
                                <p>Recibirás confirmación por correo electrónico o en la app una vez que tu compra sea procesada.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;