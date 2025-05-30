// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LoginRegister.css';
import loginImage from '../assets/img/verduraslogin.jpg';
import logo from '../assets/img/logo-mmhm.png'; 
import { supabase } from '../supabaseClient'; 

function Login() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpia cualquier error anterior
        setLoading(true); // Activa el estado de carga

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: correo,
                password: contrasena,
            });

            if (error) {
                setError(error.message); // Muestra el mensaje de error de Supabase
                console.error('Error de inicio de sesión con Supabase:', error.message);
            } else if (data.user) {
                // Si el login es exitoso, App.jsx escuchará este cambio
                // a través de onAuthStateChange y actualizará el estado global.
                console.log('Inicio de sesión exitoso:', data.user);
                navigate('/'); // Redirige al Home
            }
        } catch (err) {
            setError('Error de conexión con Supabase. Inténtalo de nuevo más tarde.');
            console.error('Error de conexión inesperado:', err);
        } finally {
            setLoading(false); // Desactiva el estado de carga al finalizar
        }
    };

    return (
        <div className="login-register-container">
            <div className="image-sidebar" style={{ backgroundImage: `url(${loginImage})` }}></div>
            <div className="form-container">
                <div className="login-register-box">
                    <div className="logo-container">
                        <img src={logo} alt="Logo MiMercahogar" />
                    </div>
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="correo">Correo Electrónico:</label>
                            <input
                                type="email"
                                id="correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="contrasena">Contraseña:</label>
                            <input
                                type="password"
                                id="contrasena"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="form-button" disabled={loading}>
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                    <p className="toggle-link">
                        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;