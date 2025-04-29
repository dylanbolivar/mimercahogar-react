import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';

function App() {
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem('carrito')) || []);
  const [usuario, setUsuario] = useState(() => localStorage.getItem('usuario') || '');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const handleLogin = (nombreUsuario) => {
    setUsuario(nombreUsuario);
    localStorage.setItem('usuario', nombreUsuario);
    navigate('/');
  };

  const handleLogout = () => {
    setUsuario('');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <>
      <Navbar contador={carrito.length} usuario={usuario} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home carrito={carrito} />} />
        <Route path="/catalogo" element={<Catalogo carrito={carrito} setCarrito={setCarrito} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </>
  );
}

export default App;
