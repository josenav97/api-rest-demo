import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantForm from './RestaurantForm';
import RestaurantList from './RestaurantList';
import './App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar los restaurantes del backend cuando el componente se monta
  useEffect(() => {
    axios.get('http://localhost:3001/restaurantes')
      .then(response => {
        setRestaurants(response.data.restaurantes);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar los restaurantes:", error);
        setLoading(false);
      });
  }, []); // El array vacío asegura que se ejecute solo una vez

  const handleRestaurantAdded = (newRestaurant) => {
    setRestaurants(prevRestaurants => [...prevRestaurants, newRestaurant]);
  };

  return (
    <div className="App">
      <h1>Gestión de Restaurantes</h1>
      <main>
        <RestaurantForm onRestaurantAdded={handleRestaurantAdded} />
        {loading ? <p>Cargando restaurantes...</p> : <RestaurantList restaurants={restaurants} />}
      </main>
    </div>
  );
}

export default App;
