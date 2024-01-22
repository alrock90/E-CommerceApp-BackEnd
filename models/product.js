const getProductModel = (sequelize, { DataTypes }) => {
    const Product = sequelize.define('product', {
      name: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      }, 
      description: { type: DataTypes.STRING,},
      price: {
        type: DataTypes.DECIMAL(10, 2), // Precisión de 10 dígitos, 2 decimales
        allowNull: false,
      },
      brand: {
        type: DataTypes.STRING,       
        allowNull: false,    
      }, 
      
      stock: {
        type: DataTypes.INTEGER, // Precisión de 10 dígitos, 2 decimales
        allowNull: false,
      },
    });
  
      
  
    return Product;
  };
  
  export default getProductModel;