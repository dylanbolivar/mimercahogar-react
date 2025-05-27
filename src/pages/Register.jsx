import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../src/css/Login.css';


const Register = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const existeUsuario = usuarios.find((u) => u.usuario === usuario);

    if (existeUsuario) {
      setError('Este usuario ya existe.');
      return;
    }

    usuarios.push({ usuario, contrasena });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('¡Registro exitoso!');
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-left"></div>

      <div className="login-right">
        <div className="login-box">
          <div className="text-center mb-4">
            <img src="/assets/img/logo-mmhm.png" alt="logo" width="200" />
          </div>
          <h2>Crear cuenta</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Usuario o correo</label>
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
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                className="form-control"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn boton-dorado w-100">
              Registrarse
            </button>
          </form>
          <div className="text-center mt-3">
            <small>¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a></small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
