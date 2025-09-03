import React, { useState } from 'react';
import axios from 'axios';

const RestaurantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisine: '',
    owner_id: 1 // Asumimos un owner_id por defecto para el ejemplo
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      // 1. Construcción de la petición con Axios
      // Usamos axios.post para enviar datos.
      // El primer argumento es la URL de tu endpoint en el backend.
      // ¡Asegúrate de que tu API esté corriendo en http://localhost:3000!
      // El segundo argumento son los datos que queremos enviar (el payload).
      const response = await axios.post('http://localhost:3000/restaurants', formData);

      // 2. Recepción de la respuesta
      // Si la petición es exitosa (código 201), Axios no lanzará un error.
      // `response.data` contendrá la respuesta JSON del backend.
      console.log('Restaurante creado:', response.data);
      
      // 3. Mostrar mensaje de éxito
      setMessage(`¡Restaurante "${response.data.name}" creado con éxito!`);
      setIsError(false);
      
      // Limpiar el formulario
      setFormData({ name: '', address: '', cuisine: '', owner_id: 1 });

    } catch (error) {
      // 2. Recepción de un error
      // Si el backend responde con un error (4xx o 5xx), Axios lo captura en el bloque catch.
      console.error('Error al crear el restaurante:', error);

      // 3. Mostrar mensaje de error
      let errorMessage = 'Ocurrió un error al crear el restaurante.';
      if (error.response && error.response.data && error.response.data.error) {
        // Si tu API envía un mensaje de error específico, lo mostramos.
        errorMessage = error.response.data.error;
      }
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Restaurante</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tipo de Cocina:</label>
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Crear Restaurante</button>
      </form>
      {message && (
        <p style={{ color: isError ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RestaurantForm;
