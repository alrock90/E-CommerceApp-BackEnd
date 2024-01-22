const getOrdersModel = (sequelize, { DataTypes }) => {
    const Orders = sequelize.define('orders', {
        total: {
            type: DataTypes.DECIMAL(10, 2), // Precisión de 10 dígitos, 2 decimales
            allowNull: true,
            },
    });
  
    Orders.associate = (models) => {
        Orders.belongsTo(models.Users);    
    };
  
    
  
    return Orders;
  };
  

module.exports = getOrdersModel;