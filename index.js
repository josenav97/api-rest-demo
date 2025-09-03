// index.js

// --- ANOTACIÓN PARA JUNIORS ---
// Este es el punto de entrada principal de nuestra aplicación.
// Su trabajo es "orquestar" las demás piezas:
// 1. Iniciar el servidor Express.
// 2. Conectar los middlewares (piezas de código que se ejecutan en cada petición).
// 3. Importar y usar los enrutadores que definen los endpoints de la API.
// 4. Poner el servidor a escuchar peticiones.

// ===== IMPORTS =====
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Importamos la instancia de la BD

// Importamos nuestros enrutadores
const userRoutes = require('./routes/users');
const restaurantRoutes = require('./routes/restaurants');
const reservationRoutes = require('./routes/reservations');
const dashboardRoutes = require('./routes/dashboard');

// ===== CONFIGURACIÓN =====
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors());

// ===== RUTAS Y CONTROLADORES =====================================
// Aquí le decimos a Express que use nuestros enrutadores.
app.use('/', dashboardRoutes); // Ruta para el dashboard en la raíz
// Todas las rutas en `userRoutes` tendrán el prefijo `/users`.
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/reservations', reservationRoutes);

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo del cierre de la aplicación para cerrar la conexión a la BD
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada.');
    process.exit(0);
  });
});