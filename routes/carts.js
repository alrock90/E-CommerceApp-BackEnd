const { Router } = require('express');
const pool = require('../db/queries'); // Importa la instancia del pool desde el módulo queries

const router = Router();

module.exports = () => {
    router.get('/carts', (request, response) => {
        response.json({ info: 'carts' });
      });
}




