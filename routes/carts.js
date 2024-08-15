
const { Router } = require('express');
const { models } = require('../models');
const passport = require('passport');
const router = Router();

const cartNotFound = 'Cart item not found';
//const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

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

 
  try {  //check if the article is in the cart
    const [result, created] = await Cart_product.findOrCreate({
      where: {
        productId: productId, cartId: cartId
      },
      defaults: {
        quantity: quantity, productId: productId, cartId: cartId
      },
    });
    if (!created) {
      // Llama a la función que maneja la actualización del carrito
      const updateCart = await updateCartItem(quantity + result.quantity, productId, cartId);

      // Manejo de la respuesta HTTP basado en el resultado de la actualización
      if (updateCart.success) {
        return response.status(200).send(updateCart.message);
      } else if (updateCart.message === cartNotFound) {
        return response.status(404).json({ success: false, message: updateCart.message });
      } else {
        return response.status(500).json({ success: false, error: updateCart.error });
      }
    }

    if (created) {
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
/*
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
*/
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
      console.log("item.cart_product?.quantity", item.cart_product?.quantity)
      console.log("productId", item.id)
      console.log("orderId", newOrder.id)
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

  // Llama a la función que maneja la actualización del carrito
  const result = await updateCartItem(quantity, productId, cartId);

  // Manejo de la respuesta HTTP basado en el resultado de la actualización
  if (result.success) {
    return response.status(200).send(result.message);
  } else if (result.message === cartNotFound) {
    return response.status(404).json({ success: false, message: result.message });
  } else {
    return response.status(500).json({ success: false, error: result.error });
  }
  /*
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
      */
};

async function updateCartItem(quantity, productId, cartId) {
  try {
    const result = await models.Cart_product.update({ quantity: quantity }, {
      where: {
        productId: productId,
        cartId: cartId
      }
    });
    if (result[0] === 0) {
      return { success: false, message: cartNotFound };
    }
    response.status(200).json({ success: true, message: 'Product updated to cart successfully', 
      products: {quantity: quantity, productId: productId, cartId: cartId} });
  } catch (error) {
    console.error(error);
    response.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


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

// Middleware para proteger las rutas
const jwt = require('jsonwebtoken');
const secretKey = process.env.SESSION_SECRET_TOKEN || 'yourSecretKey';

function isAuthenticated(req, res, next) {
  console.log('Cookies recibidas:', req.cookies); // Agrega esta línea para ver todas las cookies recibidas
  console.log("secretkey:" + secretKey)
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

router.get('/', isAuthenticated, getCart);
router.get('/checkout', isAuthenticated, checkout);
router.post('/', isAuthenticated, addItem);
router.put('/', isAuthenticated, updateItem);
router.delete('/:id', isAuthenticated, deleteItem);





module.exports = router;