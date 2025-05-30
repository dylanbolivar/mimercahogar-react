// src/pages/GestionProductos.jsx
import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';

function GestionProductos() {
    // --- Estados para el formulario de agregar producto ---
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [imagen, setImagen] = useState(''); // URL de la imagen
    const [idCategoria, setIdCategoria] = useState(''); // ID de la categoría

    const [loadingForm, setLoadingForm] = useState(false); // Para el loading del formulario
    const [mensajeForm, setMensajeForm] = useState(''); // Mensajes del formulario

    // --- Estados para la lista de productos ---
    const [productos, setProductos] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(true); // Para el loading de la lista
    const [mensajeLista, setMensajeLista] = useState(''); // Mensajes de la lista

    const { usuario } = useContext(AuthContext);

    // --- Función para cargar productos (READ) ---
    const fetchProductos = async () => {
        setLoadingProductos(true);
        setMensajeLista('');
        const { data, error } = await supabase
            .from('productos')
            .select('id, nombre, descripcion, precio, imagen, categoria_id')
            .order('nombre', { ascending: true }); // Ordena por nombre

        if (error) {
            console.error('Error al cargar productos:', error.message);
            setMensajeLista(`Error al cargar productos: ${error.message}`);
            setProductos([]);
        } else {
            setProductos(data);
        }
        setLoadingProductos(false);
    };

    // Efecto para cargar los productos cuando el componente se monta
    useEffect(() => {
        if (usuario) { // Solo carga si hay un usuario logueado (puedes ajustar esta lógica de permisos)
            fetchProductos();
        } else {
            setLoadingProductos(false);
            setMensajeLista('Inicia sesión para gestionar productos.');
        }
    }, [usuario]); // Recarga si el usuario cambia

    // --- Función para agregar un nuevo producto (CREATE) ---
    const handleAgregarProducto = async (e) => {
        e.preventDefault();

        if (!usuario) {
            setMensajeForm('Error: Debes iniciar sesión para agregar productos.');
            return;
        }

        if (!nombre || !precio || !imagen || !idCategoria) {
            setMensajeForm('Todos los campos obligatorios (Nombre, Precio, URL Imagen, ID Categoría) deben ser llenados.');
            return;
        }

        setLoadingForm(true);
        setMensajeForm('');

        try {
            const precioNum = parseFloat(precio);
            const idCategoriaNum = parseInt(idCategoria, 10);

            if (isNaN(precioNum) || precioNum <= 0) {
                setMensajeForm('El precio debe ser un número válido mayor que cero.');
                setLoadingForm(false);
                return;
            }
            if (isNaN(idCategoriaNum) || idCategoriaNum <= 0) {
                setMensajeForm('El ID de Categoría debe ser un número entero válido mayor que cero.');
                setLoadingForm(false);
                return;
            }

            const { data, error } = await supabase
                .from('productos')
                .insert([
                    {
                        nombre: nombre,
                        descripcion: descripcion,
                        precio: precioNum,
                        imagen: imagen,
                        categoria_id: idCategoriaNum
                    }
                ])
                .select(); // Para obtener el registro insertado

            if (error) {
                console.error('Error al agregar producto:', error.message);
                setMensajeForm(`Error al agregar producto: ${error.message}`);
            } else {
                setMensajeForm(`Producto "${nombre}" agregado con éxito.`);
                // Limpia el formulario
                setNombre('');
                setDescripcion('');
                setPrecio('');
                setImagen('');
                setIdCategoria('');
                // Recarga la lista de productos para mostrar el nuevo
                fetchProductos();
            }
        } catch (err) {
            console.error('Error inesperado al agregar producto:', err.message);
            setMensajeForm('Ocurrió un error inesperado. Intenta de nuevo.');
        } finally {
            setLoadingForm(false);
        }
    };

    // --- Función para eliminar un producto (DELETE) ---
    const handleEliminarProducto = async (productoId, nombreProducto) => {
        if (!usuario) {
            alert('Debes iniciar sesión para eliminar productos.');
            return;
        }
        if (!window.confirm(`¿Estás seguro de que quieres eliminar "${nombreProducto}"? Esta acción es irreversible.`)) {
            return;
        }

        setLoadingProductos(true); // Poner en loading mientras se elimina
        setMensajeLista('');

        const { error } = await supabase
            .from('productos')
            .delete()
            .eq('id', productoId); // Elimina por el ID del producto

        if (error) {
            console.error('Error al eliminar producto:', error.message);
            setMensajeLista(`Error al eliminar producto: ${error.message}`);
        } else {
            setMensajeLista(`Producto "${nombreProducto}" eliminado con éxito.`);
            // Actualiza la lista de productos quitando el eliminado
            setProductos(productos.filter(p => p.id !== productoId));
        }
        setLoadingProductos(false);
    };

    // --- Renderizado ---
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Administración de Productos</h1>

            {/* Mensaje si no hay usuario logueado */}
            {!usuario && (
                <div className="alert alert-warning text-center" role="alert">
                    Por favor, <Link to="/login">inicia sesión</Link> para gestionar productos.
                </div>
            )}

            {/* Formulario para agregar nuevo producto */}
            <div className="card p-4 shadow-sm mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 className="card-title text-center mb-4">Agregar Nuevo Producto</h3>
                <form onSubmit={handleAgregarProducto}>
                    <div className="mb-3">
                        <label htmlFor="nombreProducto" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombreProducto"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled={loadingForm || !usuario}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcionProducto" className="form-label">Descripción (Opcional)</label>
                        <textarea
                            className="form-control"
                            id="descripcionProducto"
                            rows="3"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            disabled={loadingForm || !usuario}
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="precioProducto" className="form-label">Precio</label>
                        <input
                            type="number"
                            className="form-control"
                            id="precioProducto"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            step="0.01"
                            required
                            disabled={loadingForm || !usuario}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="imagenProducto" className="form-label">URL Imagen</label>
                        <input
                            type="url"
                            className="form-control"
                            id="imagenProducto"
                            value={imagen}
                            onChange={(e) => setImagen(e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            required // Hacemos la imagen requerida por ahora
                            disabled={loadingForm || !usuario}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="idCategoria" className="form-label">ID Categoría</label>
                        <input
                            type="number"
                            className="form-control"
                            id="idCategoria"
                            value={idCategoria}
                            onChange={(e) => setIdCategoria(e.target.value)}
                            required
                            disabled={loadingForm || !usuario}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loadingForm || !usuario}>
                        {loadingForm ? 'Agregando...' : 'Agregar Producto'}
                    </button>
                </form>
                {mensajeForm && (
                    <div className={`alert mt-3 ${mensajeForm.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                        {mensajeForm}
                    </div>
                )}
            </div>

            {/* Sección para listar productos existentes */}
            <div className="mt-5">
                <h3 className="text-center mb-4">Productos Existentes</h3>
                {loadingProductos ? (
                    <p className="text-center">Cargando productos...</p>
                ) : mensajeLista ? (
                    <div className={`alert mt-3 ${mensajeLista.startsWith('Error') ? 'alert-danger' : 'alert-info'}`} role="alert">
                        {mensajeLista}
                    </div>
                ) : productos.length === 0 ? (
                    <p className="text-center">No hay productos registrados. ¡Agrega uno!</p>
                ) : (
                    <div className="row">
                        {productos.map((producto) => (
                            <div className="col-md-4 mb-4" key={producto.id}>
                                <div className="card h-100 shadow-sm">
                                    <img src={producto.imagen} className="card-img-top" alt={producto.nombre} style={{ height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{producto.nombre}</h5>
                                        <p className="card-text text-muted">{producto.descripcion || 'Sin descripción'}</p>
                                        <p className="card-text fw-bold mt-auto">Precio: ${producto.precio.toFixed(2)}</p>
                                        <p className="card-text"><small className="text-muted">ID Categoría: {producto.categoria_id}</small></p>
                                        <div className="d-flex justify-content-between mt-2">
                                            {/* Aquí podrías agregar un botón para "Editar" */}
                                            <button
                                                className="btn btn-danger btn-sm w-100"
                                                onClick={() => handleEliminarProducto(producto.id, producto.nombre)}
                                                disabled={!usuario} // Solo si está logueado
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GestionProductos;