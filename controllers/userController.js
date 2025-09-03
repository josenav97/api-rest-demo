// controllers/userController.js

// --- ANOTACIÓN PARA JUNIORS ---
// Un "controlador" es una función que recibe la petición (req) y la respuesta (res).
// Aquí es donde vive la lógica principal de la aplicación: qué hacer cuando se recibe una petición.
// Por ejemplo, validar datos, interactuar con la base de datos, y enviar una respuesta.
 
const User = require('../models/user.model'); // Importamos el Modelo de Usuario
const { userSchema } = require('../schemas/validationSchemas'); // Importamos el esquema de validación

// Controlador para crear un nuevo usuario
exports.createUser = async (req, res) => {
  const validation = userSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.flatten().fieldErrors });
  }

  try {
    const { password, ...userData } = validation.data;
    // NOTA: ¡En una app real, NUNCA guardes la contraseña en texto plano!
    // Deberías usar una librería como bcrypt para hashearla.
    userData.password_hash = `hashed_${password}`;
    
    const newUser = await User.create(userData);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
  }
};