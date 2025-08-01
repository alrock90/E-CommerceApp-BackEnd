const { v4: uuidv4 } = require('uuid');

const getUsersModel = (sequelize, { DataTypes }) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: () => uuidv4(), // Generar automáticamente un UUID
    },
    name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    telefon: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,  // Permitir valores nulos para la autenticación de Google
    },

    cartId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'carts', // Nombre de la tabla de carritos
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    // googleId: {
    //   type: DataTypes.STRING,
    //   unique: true,
    //   allowNull: true,
    // },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Orders);
    Users.belongsTo(models.Cart, { foreignKey: 'cartId' }); // Asegúrate de usar el nombre del modelo correcto
  };



  return Users;
};

module.exports = getUsersModel;