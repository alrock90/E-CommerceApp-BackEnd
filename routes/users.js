
const { Router } = require('express');
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
  //const id = parseInt(request.params.id);
  const id = request.params.id;  // Asegúrate de que esto es una cadena
  const userById = await models.Users.findByPk(id);
  if (userById === null) {
    response.status(404).send("not found!");
    console.log('Not found!');
  } else {
    response.status(200).json(userById);
  }  
};


const updateUser = async (request, response) => {
  const idUpdate = request.params.id;  // Asegúrate de que esto es una cadena
  const { name, email, telefon } = request.body;
  console.log(`id to update ${idUpdate}`);

  try {
    // Actualizar usuario
    const [updatedRows] = await models.Users.update(
      { name: name, email: email, telefon: telefon },
      {
        where: {
          id: idUpdate
        }
      }
    );

    // Verificar si se actualizó alguna fila
    if (updatedRows === 0) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }

    // Obtener el usuario actualizado
    const updatedUser = await models.Users.findByPk(idUpdate);

    // Devolver el usuario actualizado
    response.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, error: 'Internal Server Error' });
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


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redirigir al inicio de sesión si no está autenticado
}


// Middleware para proteger las rutas
/*
function isAuthenticated(req, res, next) {
  console.log('Body de la solicitud:', req.body);
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("please relogin")
  res.status(401).json({ success: false, message: 'Please login again' });
}
*/const jwt = require('jsonwebtoken');
const secretKey = process.env.SESSION_SECRET_TOKEN || 'yourSecretKey';

function isAuthenticated(req, res, next) {
  console.log('Cookies recibidas:', req.cookies); // Agrega esta línea para ver todas las cookies recibidas

  if (!req.cookies) {
    console.log("Cookies not found. Please login again.");
    return res.status(401).json({ success: false, message: 'Please login again' });
  }
  

  const token = req.cookies.session_token; // Obtén la cookie

  if (!token) {
    console.log("Token not found. Please login again.");
    return res.status(401).json({ success: false, message: 'Please login again' });
  }

  try {
    // Verifica el token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Guarda los datos decodificados del usuario en `req.user`
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ success: false, message: 'Invalid token. Please login again' });
  }
}


router.get('/', getUsers);
router.get('/:id',isAuthenticated, getUserById);
//router.post('/', createUser);
router.put('/:id',isAuthenticated, updateUser);
router.delete('/:id',isAuthenticated, deleteUser);



module.exports = router;