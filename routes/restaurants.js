// routes/restaurants.js

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const reservationController = require('../controllers/reservationController');

router.post('/', restaurantController.createRestaurant);
router.get('/', restaurantController.getRestaurants);
router.get('/:id/reservations', reservationController.getReservationsForRestaurant);

module.exports = router;

