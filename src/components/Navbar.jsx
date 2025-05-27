import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css'; 

function Navbar({ contador, usuario }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.reload(); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MiMercado</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">Catálogo</Link>
            </li>
            <li>
              <a href="/historial" className="nav-link">
              📜 Historial de compras
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <span>🛒 {contador} productos</span>

            {usuario ? (
              <>
                <span>Hola, {usuario}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </>
            ) : (
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
