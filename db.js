// db.js

// --- ANOTACIÓN PARA JUNIORS ---
// Este archivo centraliza toda la configuración y conexión con la base de datos.
// Al tenerlo separado, si en el futuro queremos cambiar de SQLite a otra base de datos (como PostgreSQL),
// solo tendríamos que modificar este archivo.

const sqlite3 = require('sqlite3').verbose();
const DB_FILE = 'restaurants.db';

// --- MODELO: Conexión a la Base de Datos ---
// Creamos una única instancia de la base de datos que se exportará y se usará
// en toda la aplicación. Esto se conoce como patrón Singleton.
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conectado a la base de datos de restaurantes.');
    // Habilitar claves foráneas es crucial para mantener la integridad de los datos
    // entre las tablas relacionadas.
    db.run('PRAGMA foreign_keys = ON;');

    // db.serialize asegura que los comandos se ejecutan en orden, uno tras otro.
    db.serialize(() => {
      // --- MODELO: Creación de Tablas ---
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          phone_number TEXT UNIQUE,
          role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'owner')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS restaurants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          owner_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          cuisine_type TEXT,
          opening_time TEXT,
          closing_time TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          restaurant_id INTEGER NOT NULL,
          reservation_time DATETIME NOT NULL,
          party_size INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'cancelled', 'completed')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
        )
      `);

      // --- MODELO: Creación de Índices ---
      // Los índices aceleran las búsquedas. Son esenciales para un buen rendimiento.
      db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);');
      db.run('CREATE INDEX IF NOT EXISTS idx_restaurants_city_cuisine ON restaurants(city, cuisine_type);');
      db.run('CREATE INDEX IF NOT EXISTS idx_reservations_restaurant_time ON reservations(restaurant_id, reservation_time);');

      console.log('Tablas e índices asegurados.');
    });
  }
});

// Exportamos la instancia de la base de datos para que otros archivos puedan usarla.
module.exports = db;

