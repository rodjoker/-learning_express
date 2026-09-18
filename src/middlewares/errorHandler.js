// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details || null;

  // Manejo de ID de Mongo inválido (ej: /users/123)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Formato de ID inválido: ${err.value}`;
  }

  // Manejo de error de clave duplicada en Mongo (índice unique de email)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedField = Object.keys(err.keyValue)[0];
    message = `El valor ingresado para '${duplicatedField}' ya está en uso`;
  }

  // Manejo de validaciones internas de Mongoose Schema
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Error de validación en la base de datos';
    details = Object.values(err.errors).map((e) => e.message);
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(details && { details }),
  });
};

module.exports = errorHandler;