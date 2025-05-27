import React, { useEffect, useState } from "react";

function Historial() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
      alert("Debes iniciar sesión para ver el historial.");
      window.location.href = "/login";
      return;
    }

    const data = JSON.parse(localStorage.getItem("historialCompras")) || [];
    const comprasUsuario = data.filter((compra) => compra.usuario === usuario);
    setHistorial(comprasUsuario);
  }, []);

  return (
    <div className="container mt-4">
      <h2>🛍️ Historial de Compras</h2>
      {historial.length === 0 ? (
        <p>No tienes compras registradas todavía.</p>
      ) : (
        historial.map((compra, index) => (
          <div key={index} className="card mb-3">
            <div className="card-header">
              <strong>Compra #{index + 1}</strong> - Total: ${compra.items.reduce((acc, item) => acc + item.precio, 0).toLocaleString()}
            </div>
            <div className="card-body">
              <div className="row">
                {compra.items.map((item, idx) => (
                  <div key={idx} className="col-md-3 text-center mb-3">
                    <img src={item.imagen} alt={item.nombre} style={{ width: "80px" }} />
                    <p className="mb-0">{item.nombre}</p>
                    <small>${item.precio.toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Historial;
