
const { Router } = require('express');
const { models } = require('../models');
const router = Router();


const getProduct = async (req, response) => {
  try {
    const allProduct = await models.Product.findAll();
    response.status(200).json(allProduct);  
} catch (error) {
    console.error("Error getting Product:", error);
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