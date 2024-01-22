/*
const express = require('express');
const router = express.Router();

// Ruta: GET /users
router.get('/', (req, res) => {
  res.send('Lista de usuarios');
});

// Ruta: GET /users/:userId
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  res.send(`Detalles del usuario con ID ${userId}`);
}); 
*/
const { Router } = require('express');
const pool = require('../db/queries'); // Importa la instancia del pool desde el módulo queries
const { models } = require('../models');
const router = Router();
/*
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const createUser = (request, response) => {
  const { name, email, telefon } = request.body;

  pool.query(
    'INSERT INTO users (name, email, telefon) VALUES ($1, $2, $3) RETURNING *',
    [name, email, telefon],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};
*/

const getUsers = async (request, response) => {
  try {
    const allUsers = await models.Users.findAll();
    response.status(200).json(allUsers);  
} catch (error) {
    console.error("Error getting users:", error);
    response.status(500).json({ error: "Internal server error" });
}
};


const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  const userById = await models.Users.findByPk(id);
  if (userById === null) {
    console.log('Not found!');
  } else {
    response.status(200).json(userById);
  }
 
  
};


const createUser = async (request, response) => {
  const { name, email, telefon } = request.body;
  // Create a new user
  const newuser = await models.Users.create({ name: name, email: email, telefon: telefon });
  console.log("new user's auto-generated ID:",  JSON.stringify(newuser.id));
 
      response.status(201).send(`User added with ID: ${ JSON.stringify(newuser.id)}`);
    
  
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);



module.exports = router;

module.exports = router;
