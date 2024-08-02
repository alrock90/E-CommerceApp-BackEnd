const Sequelize = require('sequelize');
const getUsersModel = require('./users');
const getOrdersModel = require('./orders');
const getProductModel = require('./product');
const getCartModel = require('./cart');
const getCartProductModel = require('./cart_products');
const getOrderProductModel = require('./products_orders');

/*
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    dialect: 'postgres',
  },
);
*/
const sequelize = new Sequelize(process.env.PGURL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: true,
    native: true
  }
})



const models = {
  Users: getUsersModel(sequelize, Sequelize),
  Orders: getOrdersModel(sequelize, Sequelize),
  Product: getProductModel(sequelize, Sequelize),
  Cart: getCartModel(sequelize, Sequelize),
  Cart_product: getCartProductModel(sequelize, Sequelize),
  Products_orders: getOrderProductModel(sequelize, Sequelize),
};



Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});




module.exports = {
  sequelize,
  models,
};
