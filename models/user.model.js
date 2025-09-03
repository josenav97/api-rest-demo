// models/user.model.js

const db = require('../db');

// --- ANOTACIÓN PARA JUNIORS ---
// Este es un "Modelo". Su única responsabilidad es interactuar con la tabla 'users'
// de la base de datos. Abstrae toda la lógica de SQL para que los controladores
// no necesiten saber nada sobre la base de datos.

const User = {
  /**
   * Crea un nuevo usuario en la base de datos.
   * @param {object} userData - Datos del usuario { full_name, email, password_hash, role }.
   * @returns {Promise<object>} - El usuario recién creado.
   */
  create: (userData) => {
    return new Promise((resolve, reject) => {
      const { full_name, email, password_hash, role } = userData;
      const sql = 'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)';
      
      db.run(sql, [full_name, email, password_hash, role], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed: users.email')) {
            const conflictError = new Error('El email ya está registrado.');
            conflictError.code = 'SQLITE_CONSTRAINT';
            return reject(conflictError);
          }
          return reject(err);
        }
        resolve({ id: this.lastID, ...userData });
      });
    });
  }
};

module.exports = User;