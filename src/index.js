const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.get('/health', (req,res) => {
    res.json({ status: 'ok' });
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This is some data from the API.' });
});

app.get('/error-test', (req, res) => {
  throw new Error('esto es una prueba');
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Registra el error en consola para depuración
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

