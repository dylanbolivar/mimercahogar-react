import React, { useState } from 'react';
import '../css/Login.css';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioValido = usuariosRegistrados.find(
    (u) => u.usuario === usuario && u.contrasena === contraseña
    );


    if (usuarioValido) {
      alert('Inicio de sesión exitoso');
      onLogin(usuario); // ⬅️ Aquí se notifica al App para guardar sesión y redirigir
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left"></div>

      <div className="login-right">
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Usuario o Email</label>
              <input
                type="text"
                className="form-control"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="recordarme" />
              <label className="form-check-label" htmlFor="recordarme">Recordarme</label>
            </div>

            <button className="btn boton-dorado w-100" type="submit">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
