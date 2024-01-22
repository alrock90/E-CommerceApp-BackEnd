const getCartModel = (sequelize, { DataTypes }) => {
    const Cart = sequelize.define('cart', {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    });
  
    Cart.associate = (models) => {
      Cart.belongsTo(models.User);
    };
  
    return Message;
  };
  
  export default getCartModel;