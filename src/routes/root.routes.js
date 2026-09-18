const express = require('express');
const rootRouter = express.Router();



// 3. Endpoints de la Etapa 1
rootRouter.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

rootRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

rootRouter.get('/api/data', (req, res) => {
  res.json({ message: 'This is some data from the API.' });
});

rootRouter.get('/error-test', (req, res) => {
  throw new Error('esto es una prueba');
});

module.exports = rootRouter;