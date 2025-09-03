// schemas/validationSchemas.js

// --- ANOTACIÓN PARA JUNIORS ---
// Centralizar los esquemas de validación aquí hace que sean reutilizables y fáciles de encontrar.
// Si necesitamos cambiar una regla (por ejemplo, la longitud mínima de la contraseña),
// solo lo cambiamos en un lugar.

const { z } = require('zod');

exports.restaurantSchema = z.object({
  owner_id: z.number().int().positive({ message: "El ID del propietario es obligatorio." }),
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }),
  city: z.string().min(2, { message: "La ciudad debe tener al menos 2 caracteres." }),
  cuisine_type: z.string().optional(),
});

exports.userSchema = z.object({
  full_name: z.string().min(2, { message: "El nombre completo es obligatorio." }),
  email: z.string().email({ message: "El formato del email no es válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  role: z.enum(['customer', 'owner'], { message: "El rol debe ser 'customer' o 'owner'." }),
});

exports.reservationSchema = z.object({
    user_id: z.number().int().positive({ message: "El ID de usuario es obligatorio." }),
    restaurant_id: z.number().int().positive({ message: "El ID del restaurante es obligatorio." }),
    reservation_time: z.string().datetime({ message: "El formato de fecha y hora no es válido (ISO 8601)." }),
    party_size: z.number().int().min(1, { message: "El tamaño del grupo debe ser de al menos 1." }),
});

