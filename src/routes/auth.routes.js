const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { loginSchema } = require('../schemas/auth.schema');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


    
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    // 1. Extraer email y password del body
    const { email, password } = req.body;

    // 2. Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      return next(error);
    }

    // 3. Comparar password plano con el hash guardado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Credenciales inválidas');
      error.status = 401;
      return next(error);
    }

    // 4. Firmar el JWT con el payload mínimo necesario
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // 5. Responder 200 OK con el token y el usuario (toJSON oculta el password)
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
});



module.exports = router;