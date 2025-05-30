import React, { useState, useEffect } from 'react';

function ProductoList() {
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(true);

    // Función para obtener los productos desde la API
    const fetchProductos = async () => {
        setCargando(true); // Mostrar cargando al iniciar la carga
        setMensaje(''); // Limpiar mensajes anteriores
        try {
            const response = await fetch('http://localhost:8000/productos');
            const data = await response.json();

            if (response.ok) {
                if (data && data.length > 0) { // Supabase devuelve directamente el array si la consulta es exitosa
                    setProductos(data);
                    setMensaje('Productos cargados con éxito ✅');
                } else {
                    setProductos([]);
                    setMensaje('No hay productos registrados.');
                }
            } else {
                setMensaje(`Error al cargar productos: ${data.detail || data.mensaje || 'Error desconocido'}`);
                setProductos([]);
            }
        } catch (error) {
            setMensaje(`Error de conexión o inesperado: ${error.message}`);
            console.error('Error al obtener productos:', error);
            setProductos([]);
        } finally {
            setCargando(false);
        }
    };

    // Función para eliminar un producto
    const handleDeleteProducto = async (id) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${id}?`)) {
            return; // El usuario canceló la eliminación
        }

        try {
            const response = await fetch(`http://localhost:8000/productos/${id}`, {
                method: 'DELETE',
            });

            if (response.status === 204) { // Código 204 NO_CONTENT para eliminación exitosa
                setMensaje(`Producto con ID ${id} eliminado con éxito ✅`);
                // Actualizar la lista de productos eliminando el producto del estado
                setProductos(productos.filter(producto => producto.id !== id));
            } else {
                const data = await response.json(); // Intentar leer el mensaje de error si hay
                setMensaje(`Error al eliminar producto: ${data.detail || data.mensaje || 'Error desconocido'}`);
            }
        } catch (error) {
            setMensaje(`Error de conexión o inesperado al eliminar: ${error.message}`);
            console.error('Error al eliminar producto:', error);
        }
    };

    // useEffect se ejecuta una vez al montar el componente para cargar los productos
    useEffect(() => {
        fetchProductos();
    }, []);

    if (cargando) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando productos...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2>Lista de Productos</h2>
            {mensaje && <p style={{ color: mensaje.includes('éxito') ? 'green' : 'red' }}>{mensaje}</p>}
            {productos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {productos.map(producto => (
                        <div key={producto.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
                            {producto.imagen && (
                                <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
                            )}
                            <h3>{producto.nombre}</h3>
                            <p>{producto.descripcion}</p>
                            <p><strong>Precio: ${producto.precio.toFixed(2)}</strong></p>
                            <p><small>Categoría ID: {producto.categoria_id}</small></p>
                            {/* Botón de eliminar */}
                            <button
                                onClick={() => handleDeleteProducto(producto.id)}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 12px',
                                    backgroundColor: '#dc3545', // Rojo para eliminar
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay productos para mostrar.</p>
            )}
            <button
                onClick={fetchProductos}
                style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                Recargar Productos
            </button>
        </div>
    );
}

export default ProductoList;