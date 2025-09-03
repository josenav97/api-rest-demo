import React from 'react';
import RestaurantForm from './RestaurantForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestión de Restaurantes</h1>
      </header>
      <main>
        <RestaurantForm />
      </main>
    </div>
  );
}

export default App;

