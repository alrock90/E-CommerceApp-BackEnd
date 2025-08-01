
const { Router } = require('express');
const { models } = require('../models');
const router = Router();


const getOrders = async (request, response) => {
  const actualUserId = request.user.id; //parseInt(request.params.id); //request.userId;
  try {
    const allOrders = await models.Orders.findAll({
      where: {
        userId: actualUserId
      }//,
      //include: [models.Product]
    });

    //const allOrders = await models.Orders.findAll();
    response.status(200).json(allOrders);
  } catch (error) {
    console.error("Error getting Orders:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};

/*
const getOrdersById = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    const ordersById = await models.Orders.findOne({
      where: {
        id: id
      },
      include: [{
        model: models.Product,
        attributes: ['id', 'name', 'price', 'imageurl'],
        through: {
          model: models.Products_orders,
          attributes: ['quantity']
        }
      }]
    });

    if (!ordersById) {
      response.status(404).send("Order not found!");
      console.log('Order not found!');
    } else {     
      response.status(200).json(ordersById);
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    response.status(500).send("Internal Server Error");
  }
};
*/

const getOrdersById = async (request, response) => {
  const id = parseInt(request.params.id);
  const OrdersById = await models.Orders.findOne({
    where: {
      id: id
    },
    include: [{
      model: models.Product,
      attributes: ['id', 'name', 'price', 'imageurl'],
      through: {
        model: models.Products_orders,
        attributes: ['quantity']
      }
    }]
  });
  if (OrdersById === null) {
    response.status(404).send("not found!");
    console.log('Not found!');
  } else {
    response.status(200).json(OrdersById);
  }


};

// Middleware para proteger las rutas
const jwt = require('jsonwebtoken');
const secretKey = process.env.SESSION_SECRET_TOKEN || 'yourSecretKey';

function isAuthenticated(req, res, next) {
  console.log('Cookies recibidas:', req.cookies); // Agrega esta línea para ver todas las cookies recibidas
console.log("secretkey:"+secretKey)
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


router.get('/', isAuthenticated, getOrders);
router.get('/:id', isAuthenticated, getOrdersById);

module.exports = router;