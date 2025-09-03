// controllers/reservationController.js

const Reservation = require('../models/reservation.model');
const { reservationSchema } = require('../schemas/validationSchemas');

// Controlador para crear una nueva reserva
exports.createReservation = async (req, res) => {
    const validation = reservationSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.flatten().fieldErrors });
    }

    try {
        const newReservation = await Reservation.create(validation.data);
        res.status(201).json(newReservation);
    } catch (error) {
        // Este error saltará si el user_id o restaurant_id no existen, gracias a PRAGMA foreign_keys = ON;
        return res.status(500).json({ error: `Error al crear la reserva: ${error.message}` });
    }
};

// Controlador para obtener las reservas de un restaurante específico
exports.getReservationsForRestaurant = async (req, res) => {
    try {
        const reservations = await Reservation.findByRestaurantId(req.params.id);
        res.json(reservations);
    } catch (error) {
        return res.status(500).json({ error: `Error al obtener reservas: ${error.message}` });
    }
};