const { z } = require('zod');


const loginSchema = z.object({
  email: z.string().trim().email('Formato de email no válido').toLowerCase(),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

module.exports = {
  loginSchema,
};