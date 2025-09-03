import React, { useState } from 'react';
import apiClient from './apiClient'; // Importamos nuestro cliente centralizado

function RestaurantForm({ onRestaurantAdded }) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    tipo_cocina: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre) {
      setError('El nombre es obligatorio.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const response = await apiClient.post('/restaurantes', formData); // Usamos el cliente
      alert(`Restaurante "${response.data.nombre}" guardado con éxito!`);
      onRestaurantAdded(response.data); // Llama a la función para actualizar la lista
      setFormData({ nombre: '', direccion: '', telefono: '', tipo_cocina: '' }); // Limpiar formulario
    } catch (err) {
      console.error('Error al guardar el restaurante:', err);
      setError('Hubo un error al guardar. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Añadir Nuevo Restaurante</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del Restaurante" required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="text" name="tipo_cocina" value={formData.tipo_cocina} onChange={handleChange} placeholder="Tipo de Cocina" />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Restaurante'}
      </button>
    </form>
  );
}

export default RestaurantForm;