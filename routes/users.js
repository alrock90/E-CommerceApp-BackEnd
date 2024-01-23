
const { Router } = require('express');
const pool = require('../db/queries'); // Importa la instancia del pool desde el módulo queries
const { models } = require('../models');
const router = Router();


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
    response.status(404).send("not found!");
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

const updateUser = async (request, response) => {
  const idUpdate = parseInt(request.params.id);
  const { name, email, telefon } = request.body;
      console.log(`id to uodate ${idUpdate}`)
      try {
        // Actualizar usuarios sin apellido a "Doe"
        const result = await models.Users.update({ name: name, email: email, telefon: telefon }, {
          where: {
            id: idUpdate
          }
        });  
        response.status(200).send(`User modified with ID: ${idUpdate} updatedRows: ${result[0]} `);;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
};

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);
  try{
    // Delete everyone named "Jane"
    const result = await models.Users.destroy({
      where: {
        id: id
      }
    });
    response.status(200).send(`User deleted with ID: ${id}`);
  } catch(error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });

  }
};

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);



module.exports = router;

module.exports = router;
