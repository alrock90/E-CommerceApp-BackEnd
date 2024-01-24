
const { Router } = require('express');
const { models } = require('../models');
const router = Router();


const getCart = async (request, response) => {

  const id = parseInt(request.params.id);
  try {
    const cartUser = await models.Cart.findAll({
      where: {
        userId: id
      }
    });
    response.status(200).json(cartUser);  
} catch (error) {
    console.error("Error getting Cart:", error);
    response.status(500).json({ error: "Internal server error" });
}
};




const createCart = async (request, response) => {
  // Create a new Cart
  const newCart = await models.Cart.create({ status: 'open'});
  console.log("new Cart's auto-generated ID:",  JSON.stringify(newCart.id));
 
      response.status(201).send(`Cart created: ${ JSON.stringify(newCart)}`);
    
  
};

const addItem = async (request, response) => {
  const id = parseInt(request.params.id);
  const { itemId , quantity, price } = request.body;
      try {
        // Actualizar usuarios sin apellido a "Doe"
        const result = await models.Cart.update({ name: name, email: email, telefon: telefon }, {
          where: {
            id: idUpdate
          }
        });  
        response.status(200).send(`Cart modified with ID: ${idUpdate} updatedRows: ${result[0]} `);;
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
};

const deleteCart = async (request, response) => {
  const id = parseInt(request.params.id);
  try{
    // Delete everyone named "Jane"
    const result = await models.Cart.destroy({
      where: {
        id: id
      }
    });
    response.status(200).send(`Cart deleted with ID: ${id}`);
  } catch(error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });

  }
};

router.get('/', getCart);
router.get('/:id', getCartById);
router.post('/', createCart);
router.put('/:id', updateCart);
router.delete('/:id', deleteCart);



module.exports = router;