// models/restaurant.model.js

const db = require('../db');

const Restaurant = {
  /**
   * Crea un nuevo restaurante.
   * @param {object} restaurantData - Datos del restaurante.
   * @returns {Promise<object>} - El restaurante recién creado.
   */
  create: (restaurantData) => {
    return new Promise((resolve, reject) => {
      const { owner_id, name, address, city, cuisine_type } = restaurantData;
      const sql = 'INSERT INTO restaurants (owner_id, name, address, city, cuisine_type) VALUES (?, ?, ?, ?, ?)';
      
      db.run(sql, [owner_id, name, address, city, cuisine_type], function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...restaurantData });
      });
    });
  },

  /**
   * Busca restaurantes, opcionalmente filtrando por ciudad y tipo de cocina.
   * @param {object} filters - { city, cuisine_type }.
   * @returns {Promise<Array<object>>} - Una lista de restaurantes.
   */
  findAll: ({ city, cuisine_type }) => {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM restaurants WHERE 1=1';
      const params = [];

      if (city) {
        sql += ' AND city LIKE ?';
        params.push(`%${city}%`);
      }
      if (cuisine_type) {
        sql += ' AND cuisine_type LIKE ?';
        params.push(`%${cuisine_type}%`);
      }

      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = Restaurant;