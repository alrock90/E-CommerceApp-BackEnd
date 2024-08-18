
const { Router } = require('express');
const { models } = require('../models');
const router = Router();


const getProduct = async (request, response) => {
  // Extraer y validar los parámetros de consulta
  const offset = parseInt(request.query.offset, 10) || 0;
  const limit = parseInt(request.query.limit, 10) || 10;

  // Validar los parámetros para asegurar que sean números positivos
  if (offset < 0 || limit <= 0) {
    return response.status(400).json({ error: 'Invalid offset or limit' });
  }

  try {
    // Obtener los productos con paginación
    const allProduct = await models.Product.findAll({
      offset: offset,
      limit: limit
    });

    // Obtener el total de productos para calcular si hay más productos
    const totalProducts = await models.Product.count();
    
    // Determinar si hay más productos
    const hasMore = (offset + limit) < totalProducts;

    // Enviar la respuesta
    response.status(200).json({
      products: allProduct,
      hasMore: hasMore
    });
  } catch (error) {
    console.error("Error getting products:", error);
    response.status(500).json({ error: "Internal server error" });
  }
};



const getProductById = async (request, response) => {
  const id = parseInt(request.params.id);
  const ProductById = await models.Product.findByPk(id);
  if (ProductById === null) {
    response.status(404).send("not found!");
    console.log('Not found!');
  } else {
    response.status(200).json(ProductById);
  }
};

const getProductByCategory = async (request, response) => {
  const categoryName = parseInt(request.query.categoryId);
  const ProductByCategory = await models.Product.findAll({
    where: {
      category: categoryName
    }
  });
  if (ProductByCategory === null) {
    response.status(404).send("not found!");
    console.log('Not found!');
  } else {
    response.status(200).json(ProductByCategory);
  }
};


router.get('/', getProduct);
router.get('/:id', getProductById);
router.get('/category', getProductByCategory);



module.exports = router;