const { z } = require('zod');

// Esquema para crear un usuario (POST)
const createUserSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z
    .string({ required_error: 'El email es obligatorio' })
    .trim()
    .email('El formato del email no es válido')
    .toLowerCase(),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Esquema para actualizar un usuario (PUT)
// Usamos .partial() para que los campos sean opcionales al actualizar
const updateUserSchema = createUserSchema.partial();

module.exports = {
  createUserSchema,
  updateUserSchema,
};