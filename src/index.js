const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users.routes');

dotenv.config();

// 1. Conexión a MongoDB (si falla, detiene el proceso con process.exit(1))
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// 2. Middlewares base
app.use(express.json());

// 3. Endpoints de la Etapa 1
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This is some data from the API.' });
});

app.get('/error-test', (req, res) => {
  throw new Error('esto es una prueba');
});

// 4. Montaje de las rutas del CRUD de usuarios (Etapa 2)
app.use('/users', userRoutes);

// 5. Middleware central de manejo de errores (4 parámetros)
app.use((err, req, res, next) => {
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
});

// 6. Arranque del servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});