const getCartProductModel = (sequelize, { DataTypes }) => {

  const Cart_Product = sequelize.define('cart_product', {
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



  Cart_Product.associate = (models) => {
    models.Cart.belongsToMany(models.Product, { through: models.Cart_product });
    models.Product.belongsToMany(models.Cart, { through: models.Cart_product });
  };



  return Cart_Product;
};

module.exports = getCartProductModel;
