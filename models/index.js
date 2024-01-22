const Sequelize = require('sequelize');
const getUsersModel = require('./users');
const getOrdersModel = require('./orders');

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    dialect: 'postgres',
  },
);

const models = {
  Users: getUsersModel(sequelize, Sequelize),
  Orders: getOrdersModel(sequelize, Sequelize),
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
