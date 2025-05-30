import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>LINKS DE INTERÉS</h4>
                    <ul>
                        <li><Link to="/privacidad">Aviso de Privacidad</Link></li>
                        <li><Link to="/terminos">Términos y condiciones</Link></li>
                        <li><Link to="/nosotros">Sobre Nosotros</Link></li>
                        <li><Link to="/cliente">Servicio al cliente</Link></li>
                    </ul>
                </div>
                <div className="footer-section contact-info">
                    <h4>CONTACTO</h4>
                    <p>Lunes a viernes 8:00 am a 6:00 pm - 9999-9996 o 300-856-767</p>
                    <p>contacto@email.com</p>
                    <p>mimercahogarmarket@hotmail.com</p>
                    <p>mercadoconexion@gmail.com</p>
                </div>
                <div className="footer-section social-links">
                    <h4>SÍGUENOS</h4>
                    {/* Aquí puedes usar iconos de redes sociales si tienes librerías como Font Awesome */}
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
                <p className="footer-bottom-text">© {new Date().getFullYear()} MiMercahogar. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;