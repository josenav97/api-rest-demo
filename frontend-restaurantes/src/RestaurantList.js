import React from 'react';

function RestaurantList({ restaurants }) {
  if (restaurants.length === 0) {
    return <p>No hay restaurantes guardados todavía.</p>;
  }

  return (
    <div>
      <h2>Lista de Restaurantes</h2>
      <ul>
        {restaurants.map(restaurant => (
          <li key={restaurant.id}>
            <strong>{restaurant.nombre}</strong> - {restaurant.tipo_cocina} ({restaurant.direccion})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RestaurantList;