

const getCartModel = (sequelize, { DataTypes }) => {
    const Cart = sequelize.define('cart', {
  /*     status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      }, */
    });
  /*
    Cart.associate = (models) => {
      Cart.hasOne(models.Users);
    };
  */

    Cart.associate = (models) => {
      Cart.hasOne(models.Users, { foreignKey: 'cartId' });
    };
    
    return Cart;
  };
  
  module.exports = getCartModel;