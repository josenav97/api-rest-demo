import React, { useState } from 'react';

function RestaurantForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    tipo_cocina: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar los datos a la API
    console.log('Datos a enviar:', formData);
    alert('Restaurante guardado (revisa la consola)');
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
      <button type="submit">Guardar Restaurante</button>
    </form>
  );
}

export default RestaurantForm;