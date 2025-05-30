import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
// Si tienes un logo, descomenta y asegura la ruta correcta
// import logoMercahogar from '../assets/img/logo-mmhm.png';

// Asegúrate de que App.jsx le pase 'onLogout' a Navbar
function Navbar({ contador, usuario, onLogout }) {
    const navigate = useNavigate();

    const handleCerrarSesion = async () => {
        // Llama a la función onLogout que viene de App.jsx
        // Esta función ya se encarga de llamar a supabase.auth.signOut() y limpiar el estado.
        await onLogout();
        // Opcional: podrías navegar después de cerrar sesión si onLogout no lo hace ya
        // navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    {/* Si usas un logo, descomenta y ajusta esta línea */}
                    {/* <img src={logoMercahogar} alt="MiMercahogar" className="navbar-logo" /> */}
                    MiMercado
                </Link>

                {/* Agregado el botón de "toggler" para responsividad en móviles */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                        <li className="nav-item">
                            <Link className="nav-link" to="/catalogo">Catálogo</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/gestion-productos">Gestionar Productos</Link>
                        </li>
                        <li>
                            <Link to="/historial" className="nav-link">
                                📜 Historial de compras
                            </Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <span>🛒 {contador} productos</span>

                        {usuario ? ( // Si el objeto 'usuario' existe (está logueado)
                            <>
                                {/* ACCEDE AL EMAIL DEL OBJETO USUARIO */}
                                <span>Hola, {usuario.email}</span>
                                <button className="btn btn-outline-danger btn-sm" onClick={handleCerrarSesion}>
                                    Cerrar sesión
                                </button>
                                {/* Puedes añadir un link al perfil si tienes una ruta /profile */}
                                <Link to="/profile" className="btn btn-outline-info btn-sm">Perfil</Link>
                            </>
                        ) : ( // Si 'usuario' es null (no logueado)
                            <>
                                <Link to="/login" className="btn btn-outline-primary btn-sm">
                                    Iniciar sesión
                                </Link>
                                <Link to="/register" className="btn btn-outline-success btn-sm">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;