const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validate = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../schemas/user.schema');

// 1. POST /users — Crea usuario
router.post('/', validate(createUserSchema), async (req, res, next) => {
  try {
    const { email } = req.body;

    // Verificar si el correo ya existe antes de persistir
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('El correo electrónico ya está registrado');
      error.status = 409;
      return next(error);
    }

    // El hook pre('save') se encarga de hashear el password
    const user = new User(req.body);
    await user.save();

    // toJSON configurado en el Schema oculta el password automáticamente
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// 2. GET /users — Lista todos los usuarios
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// 3. GET /users/:id — Obtiene un usuario por id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 4. PUT /users/:id — Actualiza usuario
router.put('/:id', validate(updateUserSchema), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }

    // Si viene email y es distinto al actual, chequear duplicados
    if (req.body.email && req.body.email !== user.email) {
      const emailInUse = await User.findOne({ email: req.body.email });
      if (emailInUse) {
        const error = new Error('El correo electrónico ya está registrado');
        error.status = 409;
        return next(error);
      }
    }

    // Actualizamos campos manualmente y usamos .save()
    // para que el hook pre('save') hashee el password si este cambió
    Object.assign(user, req.body);
    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /users/:id — Elimina usuario
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      return next(error);
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;