import React, { useState } from 'react';

function ProductoForm() {
    // Estados para los campos del formulario
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [imagen, setImagen] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [mensaje, setMensaje] = useState(''); // Para mostrar mensajes al usuario
    const [esExito, setEsExito] = useState(false); // <-- ¡NUEVO ESTADO! Para controlar el color del mensaje

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario

        // Limpiar mensajes anteriores
        setMensaje('');
        setEsExito(false);

        // Validar que los campos no estén vacíos y que precio/categoria_id sean números válidos
        if (!nombre || !descripcion || !precio || !categoriaId) {
            setMensaje('Por favor, completa todos los campos.');
            return;
        }
        if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
            setMensaje('El precio debe ser un número válido mayor que cero.');
            return;
        }
        if (isNaN(parseInt(categoriaId)) || parseInt(categoriaId) <= 0) {
            setMensaje('El ID de categoría debe ser un número entero válido.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/productos', { // <-- ¡IMPORTANTE! Asegúrate de que esta URL coincida con la de tu FastAPI
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion,
                    precio: parseFloat(precio), // Convertir a número flotante
                    imagen: imagen, // Puede ser opcional, según tu modelo Pydantic
                    categoria_id: parseInt(categoriaId) // Convertir a número entero
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje('Producto agregado con éxito ✅');
                setEsExito(true); // <-- Actualiza el estado de éxito
                // Limpiar el formulario después del envío exitoso
                setNombre('');
                setDescripcion('');
                setPrecio('');
                setImagen('');
                setCategoriaId('');
                // Opcional: Si tienes una función para actualizar la lista de productos en el padre, llámala aquí.
                // Por ejemplo, props.onProductoAdded();
            } else {
                // Manejar errores de la API (por ejemplo, el mensaje de error que devuelve FastAPI)
                setMensaje(`Error al agregar producto: ${data.detail || data.mensaje || 'Error desconocido'}`);
                setEsExito(false); // <-- Actualiza el estado de éxito
            }
        } catch (error) {
            // Manejar errores de red o cualquier otra excepción
            setMensaje(`Error de conexión o inesperado: ${error.message}`);
            setEsExito(false); // <-- Actualiza el estado de éxito
            console.error('Error al enviar el formulario de producto:', error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Agregar Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="precio" style={{ display: 'block', marginBottom: '5px' }}>Precio:</label>
                    <input
                        type="number"
                        id="precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        step="0.01" // Permite decimales
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="imagen" style={{ display: 'block', marginBottom: '5px' }}>URL Imagen (Opcional):</label>
                    <input
                        type="text"
                        id="imagen"
                        value={imagen}
                        onChange={(e) => setImagen(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="categoriaId" style={{ display: 'block', marginBottom: '5px' }}>ID Categoría:</label>
                    <input
                        type="number"
                        id="categoriaId"
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Agregar Producto
                </button>
            </form>
            {/* Aquí usamos el nuevo estado 'esExito' */}
            {mensaje && <p style={{ marginTop: '15px', color: esExito ? 'green' : 'red' }}>{mensaje}</p>}
        </div>
    );
}

export default ProductoForm;