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
    description: { type: DataTypes.STRING, },
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageurl: {
      type: DataTypes.STRING,
      allowNull: true, // Permitir que sea nulo si no siempre se requiere
      validate: {
        isUrl: true, // Validar que sea una URL válida
      },
    },
  }, {
    timestamps: false
  });

  // Definición de las asociaciones
  Product.associate = (models) => {
    Product.belongsToMany(models.Orders, { through: models.Products_orders });
    Product.belongsToMany(models.Cart, { through: models.Cart_product }); // Usar 'Cart_product' en lugar de 'Cart_Product'



  };


  return Product;
};
module.exports = getProductModel;