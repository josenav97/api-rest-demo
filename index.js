const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3001; // Puerto para el backend

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite a Express entender JSON en el body

// Conectar a la base de datos (la creará si no existe)
const db = new sqlite3.Database('./restaurantes.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    // Crear tabla si no existe
    db.run('CREATE TABLE IF NOT EXISTS restaurantes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, direccion TEXT, telefono TEXT, tipo_cocina TEXT)');
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Restaurantes funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});