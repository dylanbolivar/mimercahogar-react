// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LoginRegister.css';
import registerImage from '../assets/img/verduraslogin.jpg';
import logo from '../assets/img/logo-mmhm.png';
import { supabase } from '../supabaseClient';

function Register() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Paso 1: Registrar el usuario en la autenticación de Supabase
            const { data, error: authError } = await supabase.auth.signUp({
                email: correo,
                password: contrasena,
                // Puedes añadir metadata si quieres guardar el 'nombre' en auth.users,
                // pero también lo insertaremos en public.usuarios
                options: {
                    data: {
                        full_name: nombre, // Guardar el nombre como metadata en auth.users
                    },
                },
            });

            if (authError) {
                setError(authError.message);
                console.error('Error de registro con Supabase Auth:', authError.message);
            } else if (data.user) {

                const { error: dbError } = await supabase
                    .from('usuarios') // Tu tabla de usuarios en el esquema public
                    .insert([
                        {
                            usuario_id: data.user.id, // ID del usuario de Supabase Auth
                            nombre: nombre,
                            correo: correo,
                        },
                    ]);

                if (dbError) {
                    console.error('Error al insertar usuario en la tabla "usuarios":', dbError.message);

                    setError('Registro exitoso, pero no se pudo guardar la información adicional del usuario. Inténtalo de nuevo o contacta soporte.');
                } else {
                    setSuccess('¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta (si está activada la verificación) y luego inicia sesión.');
                    console.log('Usuario registrado en Supabase Auth y tabla "usuarios":', data.user);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }

            } else if (data.session) {

                setSuccess('¡Registro exitoso! Iniciando sesión...');
                console.log('Registro exitoso y sesión iniciada:', data.session.user);
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
        } catch (err) {
            setError('Error de conexión con Supabase. Inténtalo de nuevo más tarde.');
            console.error('Error de conexión inesperado:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-register-container">
            <div className="image-sidebar" style={{ backgroundImage: `url(${registerImage})` }}></div>
            <div className="form-container">
                <div className="login-register-box">
                    <div className="logo-container">
                        <img src={logo} alt="Logo MiMercahogar" />
                    </div>
                    <h2>Registrarse</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="nombre">Nombre de Usuario:</label>
                            <input
                                type="text"
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
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
                        {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
                        <button type="submit" className="form-button" disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>
                    <p className="toggle-link">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;