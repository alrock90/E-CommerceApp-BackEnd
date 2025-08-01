

const getProductsOrdersModel = (sequelize, { DataTypes }) => {

  const Products_orders = sequelize.define('products_orders', {
    //selfGranted: DataTypes.BOOLEAN,
    /* price: {
      type: DataTypes.DECIMAL(10, 2), // Precisión de 10 dígitos, 2 decimales
      allowNull: false,
    }, */

    quantity: {
      type: DataTypes.INTEGER, // Precisión de 10 dígitos, 2 decimales
      allowNull: false,
    },
  }, { timestamps: false });


  Products_orders.associate = (models) => {
    models.Orders.belongsToMany(models.Product, { through: models.Products_orders });
    models.Product.belongsToMany(models.Orders, { through: models.Products_orders });
  };


/*
  Products_orders.associate = (models) => {
    //Products_orders.belongsTo(models.Users);

    models.Product.belongsToMany(models.Orders, { through: models.Products_orders });
    models.Orders.belongsToMany(models.Product, { through: models.Products_orders });
  };
*/


  return Products_orders;
};


module.exports = getProductsOrdersModel;