import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function CategoriaList({ onEditCategoria }) {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = "http://127.0.0.1:8000"; // Asegúrate de que esta URL sea correcta

    useEffect(() => {
        fetchCategorias();
    }, []); // Se ejecuta una vez al montar el componente

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/categorias`);
            // Asegúrate de que la respuesta de tu API de categorías devuelva una lista de categorías directamente
            // Si tu API devuelve un objeto como {"mensaje": "", "categorias": [...]}, ajusta esto:
            setCategorias(response.data); // Asumo que response.data es directamente el array de categorías
            // Si la respuesta es {"mensaje": "Categorías obtenidas ✅", "categorias": [...]}, entonces sería:
            // setCategorias(response.data.categorias);
            setError(null);
        } catch (err) {
            console.error("Error al obtener categorías:", err);
            setError("No se pudieron cargar las categorías. Inténtalo de nuevo.");
            setCategorias([]); // Limpiar categorías si hay error
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategoria = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_URL}/categorias/${id}`);
                    Swal.fire(
                        '¡Eliminada!',
                        'La categoría ha sido eliminada.',
                        'success'
                    );
                    fetchCategorias(); // Recargar la lista de categorías
                } catch (err) {
                    console.error("Error al eliminar categoría:", err);
                    let errorMessage = "No se pudo eliminar la categoría. Inténtalo de nuevo.";
                    if (err.response && err.response.data && err.response.data.detail) {
                        errorMessage = err.response.data.detail;
                    }
                    Swal.fire(
                        'Error',
                        errorMessage,
                        'error'
                    );
                }
            }
        });
    };

    if (loading) {
        return <p>Cargando categorías...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (categorias.length === 0) {
        return <p>No hay categorías registradas. ¡Crea una nueva!</p>;
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Lista de Categorías</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {categorias.map((categoria) => (
                    <li key={categoria.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
                        <span>{categoria.nombre}</span>
                        <div>
                            <button
                                onClick={() => onEditCategoria(categoria)}
                                style={{
                                    backgroundColor: '#007bff', color: 'white', border: 'none',
                                    padding: '8px 12px', borderRadius: '4px', cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteCategoria(categoria.id)}
                                style={{
                                    backgroundColor: '#dc3545', color: 'white', border: 'none',
                                    padding: '8px 12px', borderRadius: '4px', cursor: 'pointer'
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoriaList;