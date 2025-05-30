import React, { useState, useEffect, createContext } from 'react'; // Asegúrate de importar createContext
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Register from './pages/Register';
import Historial from './pages/Historial';
import GestionProductos from './pages/GestionProductos';
import Footer from './components/Footer';

import { supabase } from './supabaseClient';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// ¡Añade esta línea aquí para exportar el contexto!
export const AuthContext = createContext(null);

function App() {
    const [carrito, setCarrito] = useState(() => {
        const savedCarrito = localStorage.getItem('carrito');
        return savedCarrito ? JSON.parse(savedCarrito) : [];
    });

    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUsuario(session.user);
                console.log('Usuario logueado:', session.user.email);
            } else {
                setUsuario(null);
                console.log('Usuario deslogueado.');
            }
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUsuario(session.user);
            }
        });
        return () => {
            if (authListener && typeof authListener.unsubscribe === 'function') {
                authListener.unsubscribe();
            }
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error.message);
        } else {
            setUsuario(null);
            setCarrito([]);
            localStorage.removeItem('carrito');
            navigate('/');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
            try {
                const { error } = await supabase.auth.signOut();

                if (error) {
                    console.error('Error al intentar "eliminar" la cuenta (cerrar sesión):', error.message);
                    alert('Ocurrió un error al intentar eliminar la cuenta.');
                } else {
                    alert("Tu sesión ha sido cerrada. Para una eliminación real de la cuenta, se requeriría una confirmación adicional o una función de servidor.");
                    setUsuario(null);
                    setCarrito([]);
                    localStorage.removeItem('carrito');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error general al intentar eliminar la cuenta:', error.message);
                alert('Ocurrió un error al intentar eliminar la cuenta.');
            }
        }
    };

    return (
        <AuthContext.Provider value={{ usuario, setUsuario }}> {/* ¡Asegúrate de envolver todo con AuthContext.Provider! */}
            <Navbar contador={carrito.length} usuario={usuario} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home carrito={carrito} />} />
                <Route path="/catalogo" element={<Catalogo carrito={carrito} setCarrito={setCarrito} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/gestion-productos" element={<GestionProductos />} />
                {usuario && (
                    <Route
                        path="/profile"
                        element={
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <h2>Perfil de Usuario</h2>
                                <p>Email: {usuario.email}</p>
                                <button
                                    onClick={handleDeleteAccount}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginTop: '20px'
                                    }}
                                >
                                    Eliminar Cuenta (Demo)
                                </button>
                                <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#666' }}>
                                    (En la demo, esta acción cierra la sesión y simula la eliminación, no la realiza físicamente en Supabase.)
                                </p>
                            </div>
                        }
                    />
                )}
            </Routes>
            <Footer />
        </AuthContext.Provider>
    );
}

export default App;