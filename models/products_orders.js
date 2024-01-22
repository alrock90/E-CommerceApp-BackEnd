

const getProductsOrdersModel = (sequelize, { DataTypes }) => {
   
    const Products_orders = sequelize.define('Products_orders', {
        selfGranted: DataTypes.BOOLEAN,
        price: {
            type: DataTypes.DECIMAL(10, 2), // Precisión de 10 dígitos, 2 decimales
            allowNull: false,
          },        
          
        quantity: {
            type: DataTypes.INTEGER, // Precisión de 10 dígitos, 2 decimales
            allowNull: false,
          },
    }, { timestamps: false });

    Products_orders.associate = (models) => {
        Products_orders.belongsTo(models.users);    
    };
    Product.belongsToMany(Orders, { through: Product_order });
    Orders.belongsToMany(Product, { through: Product_order });

  
    
  
    return Products_orders;
  };
  
  export default getProductsOrdersModel;