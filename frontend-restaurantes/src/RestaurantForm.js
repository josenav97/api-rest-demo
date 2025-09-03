import React, { useState } from 'react';
import axios from 'axios'; // 1. Importar axios

function RestaurantForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    tipo_cocina: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => { // 2. Convertir la función a async
    e.preventDefault();
    setIsSubmitting(true); // Empezamos a enviar, deshabilitamos el botón
    try {
      // 3. Usar axios para enviar una petición POST a la API
      const response = await axios.post('http://localhost:3001/restaurantes', formData);
      console.log('Restaurante guardado:', response.data);
      alert(`Restaurante "${response.data.nombre}" guardado con éxito!`);
      // Limpiar el formulario después de guardar
      setFormData({
        nombre: '',
        direccion: '',
        telefono: '',
        tipo_cocina: ''
      });
    } catch (error) {
      console.error('Error al guardar el restaurante:', error);
      alert('Hubo un error al guardar el restaurante.');
    } finally {
      setIsSubmitting(false); // Terminó el envío, habilitamos el botón de nuevo
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Añadir Nuevo Restaurante</h2>
      <div>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del Restaurante" required />
      </div>
      <div>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" required />
      </div>
      <div>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
      </div>
      <div>
        <input type="text" name="tipo_cocina" value={formData.tipo_cocina} onChange={handleChange} placeholder="Tipo de Cocina" />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar Restaurante'}
      </button>
    </form>
  );
}

export default RestaurantForm;