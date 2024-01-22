

const getCartProductModel = (sequelize, { DataTypes }) => {
   
    const Cart_Product = sequelize.define('Cart_Product', {
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
    Cart.belongsToMany(Product, { through: Cart_Product });
    Product.belongsToMany(Cart, { through: Cart_Product });

  
    
  
    return Cart_Product;
  };
  
  export default getCartProductModel;