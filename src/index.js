const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users.routes');
const rootRoutes = require('./routes/root.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

// 1. Conexión a MongoDB (si falla, detiene el proceso con process.exit(1))
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// 2. Middlewares base
app.use(express.json());

//Rutas de prueba para la Etapa 1
app.use('/', rootRoutes);

// 4. Montaje de las rutas del CRUD de usuarios (Etapa 2)
app.use('/users', userRoutes);

// 4. Montaje de las rutas de autenticación (Etapa 3)
app.use('/login', authRoutes);

// 5. Middleware central de manejo de errores (4 parámetros)
app.use(errorHandler);

// 6. Arranque del servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});