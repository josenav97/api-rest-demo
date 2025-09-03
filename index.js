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

// Ruta para crear un nuevo restaurante (POST)
app.post('/restaurantes', (req, res) => {
  const { nombre, direccion, telefono, tipo_cocina } = req.body;
  const sql = 'INSERT INTO restaurantes (nombre, direccion, telefono, tipo_cocina) VALUES (?, ?, ?, ?)';

  db.run(sql, [nombre, direccion, telefono, tipo_cocina], function(err) {
    if (err) {
      console.error('Error al insertar en la base de datos', err.message);
      return res.status(500).json({ error: err.message });
    }
    // Devuelve el restaurante recién creado con su nuevo ID
    res.status(201).json({
      id: this.lastID,
      ...req.body
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});