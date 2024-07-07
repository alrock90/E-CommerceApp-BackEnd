
const { Router } = require('express');
const { models } = require('../models');
const passport = require('passport');
const router = Router();
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

// Middleware para proteger las rutas con Passport
const authenticateUser = passport.authenticate('local', { session: false });

const getCart = async (req, response) => {
  //console.log(req.user);
  const user = req.user;
  //const cartId = parseInt(req.params.id);
  console.log("userId:", user.id)
  console.log("cartId:", user.cartId)
  try {
    const cartUser = await models.Cart.findAll({
      where: {
        id: user.cartId
      },
      include: [models.Product]
    });
    response.status(200).json(cartUser[0].products);

  } catch (error) {
    console.error("Error getting Cart:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};

const addItem = async (request, response) => {
  console.log("entre a addItem");
  console.log(request.user);
  const { productId, quantity, cartId } = request.body;

  try {
    const result = await models.Cart_product.create(
      {
        quantity: quantity,
        productId: productId,
        cartId: cartId
      });
    if (result) {
      // Si se agrega correctamente, devolver el nuevo producto agregado
      const newProduct = await models.Product.findByPk(productId);
      response.status(200).json({ success: true, message: 'Product added to cart successfully', products: newProduct });
    } else {
      response.status(400).json({ success: false, error: 'Failed to add product to cart' });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


const checkout = async (request, response) => {
  const cartId = request.user.cartId;
  console.log("cartId:", cartId)
  const cartToCheckOut = await models.Cart.findAll({
    where: {
      id: cartId
    },
    include: [models.Product]
  });
  const productInCart = cartToCheckOut[0].products;

  console.log("productInCart")
  console.log(productInCart)

  //if the cart is empty, go out and not create the order
  if (!productInCart || productInCart.length === 0) {
    console.log("cart empty")
    return response.status(400).json({ success: false, error: 'El carrito está vacío' });
  }

  //calculate total
  var total = 0;
  productInCart.forEach(item => {
    console.log("item.productId", item.id)
    const quantity = item.cart_product?.quantity;
    total += item.price * quantity;

  });

  console.log("total:", total)

  try {
    //new order
    const newOrder = await models.Orders.create({ total: total, userId: request.user.id });
    //copy productos to products_order
    
    for (const item of productInCart) {
      console.log("item.cart_product?.quantity",item.cart_product?.quantity)
      console.log("productId",item.id)
      console.log("orderId",newOrder.id)
      const result = await models.Products_orders.create(
        {
          quantity: item.cart_product?.quantity,
          productId: item.id,
          orderId: newOrder.id
        }
         //{        where: {cartId: cartId}      }
      );
    };
    //delete al items en cart
    const result = await models.Cart_product.destroy({
      where: {
        cartId: cartId
      }
    });

    console.log("cart deleted")
    //send response
    response.status(200).send(`Order add new  `);;

  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const updateItem = async (request, response) => {
  const cartId = request.user.cartId;
  const { productId, quantity } = request.body;

  try {
    const result = await models.Cart_product.update({ quantity: quantity }, {
      where: {
        productId: productId,
        cartId: cartId
      }
    });
    response.status(200).send(`Cart_product updated  `);;
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const deleteItem = async (request, response) => {
  const cartId = request.user.cartId;
  const productId = parseInt(request.params.id);
  console.log("entre a delete")
  console.log("productId " + productId);

  try {
    const result = await models.Cart_product.destroy({
      where: {
        cartId: cartId,
        productId: productId
      }
    });
    if (result) {
      response.status(200).json({
        success: true,
        message: `Product with ID ${productId} deleted from cart`,
        productId: productId
      });
    } else {
      response.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found in cart`,
        productId: productId
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

router.get('/', getCart);
router.get('/checkout', checkout);
router.post('/', addItem);
router.put('/', updateItem);
router.delete('/:id', deleteItem);





module.exports = router;