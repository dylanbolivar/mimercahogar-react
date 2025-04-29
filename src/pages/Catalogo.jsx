// src/pages/Catalogo.jsx
import React, { useState, useEffect } from "react";
import "../css/catalogo.css";

// Imágenes
import aseo1 from "../assets/img/aseo1.png";
import aseo2 from "../assets/img/aseo2.png";
import aseo3 from "../assets/img/aseo3.png";
import aseo4 from "../assets/img/aseo4.png";
import aseo5 from "../assets/img/aseo5.png";
import aseo6 from "../assets/img/aseo6.png";

import snack1 from "../assets/img/snack1.png";
import snack2 from "../assets/img/snack2.png";
import snack3 from "../assets/img/snack3.png";
import snack4 from "../assets/img/snack4.png";
import snack5 from "../assets/img/snack5.png";
import snack6 from "../assets/img/snack6.png";

import bebida1 from "../assets/img/bebida1.png";
import bebida2 from "../assets/img/bebida2.png";
import bebida3 from "../assets/img/bebida3.png";
import bebida4 from "../assets/img/bebida4.png";
import bebida5 from "../assets/img/bebida5.png";
import bebida6 from "../assets/img/bebida6.png";

import despensa1 from "../assets/img/despensa1.png";
import despensa2 from "../assets/img/despensa2.png";
import despensa3 from "../assets/img/despensa3.png";
import despensa4 from "../assets/img/despensa4.png";
import despensa5 from "../assets/img/despensa5.png";
import despensa6 from "../assets/img/despensa6.png";


function Catalogo() {
  const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem("carrito")) || []);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (nombre, precio, imagen) => {
    setCarrito([...carrito, { nombre, precio, imagen }]);
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const productos = [
    // Aseo
    { nombre: "Blanqueador EKONO (2000 ml)", precio: 2780, imagen: aseo1 },
    { nombre: "Detergente ARIEL Triple Poder (5000 gr)", precio: 59600, imagen: aseo2 },
    { nombre: "Lavaloza Limón EKONO (500 ml)", precio: 2590, imagen: aseo3 },
    { nombre: "Detergente REY (900 gr)", precio: 8140, imagen: aseo4 },
    { nombre: "Esponja ETERNA pague 2 lleve 4", precio: 5780, imagen: aseo6 },
    { nombre: "Servilleta EKONO (200 und)", precio: 2170, imagen: aseo5 },
    // Snacks
    { nombre: "Nachos FRESCAMPO (180 gr)", precio: 3490, imagen: snack1 },
    { nombre: "Pasabocas RAMO x12 (300 gr)", precio: 16450, imagen: snack2 },
    { nombre: "CHEETOS Boliqueso (34 gr)", precio: 1800, imagen: snack3 },
    { nombre: "Papas MARGARITA Tomate", precio: 6480, imagen: snack4 },
    { nombre: "Crispetas POPETAS Mix", precio: 4390, imagen: snack5 },
    { nombre: "Pasabocas TODO RICO", precio: 20600, imagen: snack6 },
    // Despensa
    { nombre: "Aceite FRESCAMPO (3000 ml)", precio: 20980, imagen: despensa1 },
    { nombre: "Lenteja FRESCAMPO (500 gr)", precio: 3280, imagen: despensa2 },
    { nombre: "Harina PAN (1000 gr)", precio: 3400, imagen: despensa3 },
    { nombre: "Pasta LA MUNECA Spaguetti", precio: 5940, imagen: despensa4 },
    { nombre: "Galletas Saltín Noel", precio: 10900, imagen: despensa5 },
    { nombre: "Arroz DIANA (3000 gr)", precio: 12900, imagen: despensa6 },
    // Bebidas
    { nombre: "POWERADE x3 (1500 ml)", precio: 4173, imagen: bebida1 },
    { nombre: "COCA COLA + Quatro x2", precio: 15100, imagen: bebida2 },
    { nombre: "COCA COLA x2 (5000 ml)", precio: 11500, imagen: bebida3 },
    { nombre: "Malta PONY MALTA x6", precio: 7750, imagen: bebida4 },
    { nombre: "Agua BRISA (6000 ml)", precio: 7264, imagen: bebida5 },
    { nombre: "Gaseosa SCHWEPPES", precio: 3310, imagen: bebida6 },
  ];

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="container mt-4">
      {/* Buscador y botón carrito */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar productos..."
          className="form-control w-75"
        />
        <button className="btn btn-outline-success ms-3" onClick={() => setMostrarCarrito(true)}>
          🛒 Ver carrito <span className="badge bg-danger">{carrito.length}</span>
        </button>
      </div>

      {/* Lista de productos */}
      <div className="row">
        {filtrados.map((producto, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100">
              <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">${producto.precio.toLocaleString()}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => agregarAlCarrito(producto.nombre, producto.precio, producto.imagen)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carrito - solo si está activo */}
      {mostrarCarrito && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" style={{ visibility: "visible", position: "fixed" }}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Carrito de Compras</h5>
            <button className="btn-close" onClick={() => setMostrarCarrito(false)}></button>
          </div>
          <div className="offcanvas-body">
            {carrito.length === 0 && <p>Tu carrito está vacío.</p>}
            {carrito.map((item, index) => (
              <div className="d-flex justify-content-between align-items-center mb-2" key={index}>
                <div className="d-flex align-items-center">
                  <img src={item.imagen} alt={item.nombre} width="50" className="me-2" />
                  <div>
                    <h6 className="mb-0">{item.nombre}</h6>
                    <small>${item.precio.toLocaleString()}</small>
                  </div>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => eliminarDelCarrito(index)}>🗑️</button>
              </div>
            ))}
          </div>
          <div className="offcanvas-footer border-top p-3">
            <h5>Total: ${total.toLocaleString()}</h5>
            <button className="btn btn-success w-100">Finalizar Compra</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Catalogo;
