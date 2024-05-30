
const { Router } = require('express');
const { models } = require('../models');
const router = Router();


const getOrders = async (request, response) => {
  const actualUserId = request.user.id; //parseInt(request.params.id); //request.userId;
  try {
    const allOrders= await models.Orders.findAll({
       where: {
           userId: actualUserId
       }
      });    

    //const allOrders = await models.Orders.findAll();
    response.status(200).json(allOrders);
  } catch (error) {
    console.error("Error getting Orders:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};


const getOrdersById = async (request, response) => {
  const id = parseInt(request.params.id);
  const OrdersById = await models.Orders.findByPk(id);
  if (OrdersById === null) {
    response.status(404).send("not found!");
    console.log('Not found!');
  } else {
    response.status(200).json(OrdersById);
  }


};


router.get('/', getOrders);
router.get('/:id', getOrdersById);

module.exports = router;