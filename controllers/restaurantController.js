// controllers/restaurantController.js

const Restaurant = require('../models/restaurant.model');
const { restaurantSchema } = require('../schemas/validationSchemas');

// Controlador para crear un nuevo restaurante
exports.createRestaurant = async (req, res) => {
  const validation = restaurantSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.flatten().fieldErrors });
  }

  try {
    const newRestaurant = await Restaurant.create(validation.data);
    res.status(201).json(newRestaurant);
  } catch (error) {
    return res.status(500).json({ error: `Error al crear restaurante: ${error.message}` });
  }
};

// Controlador para buscar/listar restaurantes
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll(req.query);
    res.json(restaurants);
  } catch (error) {
    return res.status(500).json({ error: `Error al buscar restaurantes: ${error.message}` });
  }
};