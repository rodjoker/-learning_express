const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Formato esperado: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Acceso no autorizado: Token ausente o mal formado');
    err.status = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Inyectamos { id: user._id } en req para las siguientes funciones
    next();
  } catch (error) {
    const err = new Error('Token inválido o expirado');
    err.status = 401;
    return next(err);
  }
};

module.exports = verifyToken;