// routes/users.js

// --- ANOTACIÓN PARA JUNIORS ---
// Este archivo define las "rutas" para todo lo relacionado con usuarios.
// Una ruta es la combinación de un método HTTP (POST, GET, PUT, DELETE) y una URL.
// Cada ruta se asocia a una función controladora que se ejecutará cuando se reciba una petición.

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);

module.exports = router;

