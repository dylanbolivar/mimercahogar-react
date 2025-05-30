import React, { useState } from 'react';
import CategoriaForm from '../components/CategoriaForm'; // Asegúrate de que la ruta sea correcta
import CategoriaList from '../components/CategoriaList'; // Asegúrate de que la ruta sea correcta

function GestionCategorias() {
    // Estado para la categoría que se va a editar (null si es una nueva categoría)
    const [categoriaToEdit, setCategoriaToEdit] = useState(null);
    // Estado para forzar la recarga de la lista de categorías después de guardar
    const [refreshList, setRefreshList] = useState(0);

    // Función que se llama cuando una categoría se guarda (crea o actualiza)
    const handleCategoriaSaved = () => {
        setCategoriaToEdit(null); // Limpiar el formulario de edición
        setRefreshList(prev => prev + 1); // Incrementa el contador para forzar la recarga de CategoriaList
    };

    // Función que se pasa a CategoriaList para que pueda indicar qué categoría editar
    const handleEditCategoria = (categoria) => {
        setCategoriaToEdit(categoria); // Establece la categoría a editar en el estado
    };

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Administración de Categorías</h1>

            {/* Componente para el formulario de agregar/editar categorías */}
            <section style={{ marginBottom: '40px' }}>
                <CategoriaForm
                    categoriaToEdit={categoriaToEdit} // Pasa la categoría a editar al formulario
                    onCategoriaSaved={handleCategoriaSaved} // Pasa la función para notificar al padre
                />
            </section>

            {/* Componente para la lista de categorías */}
            <section>
                <CategoriaList
                    key={refreshList} // La 'key' es crucial para forzar la recarga del componente cuando refreshList cambia
                    onEditCategoria={handleEditCategoria} // Pasa la función para editar categorías
                />
            </section>
        </div>
    );
}

export default GestionCategorias;