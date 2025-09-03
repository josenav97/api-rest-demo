// models/reservation.model.js

const db = require('../db');

const Reservation = {
  /**
   * Crea una nueva reserva.
   * @param {object} reservationData - Datos de la reserva.
   * @returns {Promise<object>} - La reserva recién creada.
   */
  create: (reservationData) => {
    return new Promise((resolve, reject) => {
      const { user_id, restaurant_id, reservation_time, party_size } = reservationData;
      const sql = 'INSERT INTO reservations (user_id, restaurant_id, reservation_time, party_size) VALUES (?, ?, ?, ?)';
      
      db.run(sql, [user_id, restaurant_id, reservation_time, party_size], function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...reservationData });
      });
    });
  },

  /**
   * Encuentra todas las reservas para un restaurante específico.
   * @param {number} restaurantId - El ID del restaurante.
   * @returns {Promise<Array<object>>} - Una lista de reservas con detalles del cliente.
   */
  findByRestaurantId: (restaurantId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT r.id, r.reservation_time, r.party_size, r.status, u.full_name as customer_name
        FROM reservations r
        JOIN users u ON r.user_id = u.id
        WHERE r.restaurant_id = ?
        ORDER BY r.reservation_time DESC
      `;
      db.all(sql, [restaurantId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
};

module.exports = Reservation;