const getUsersModel = (sequelize, { DataTypes }) => {
  const Users = sequelize.define('users', {
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
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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
  });

  Users.associate = (models) => {
    Users.hasMany(models.Orders);
    Users.belongsTo(models.Cart, { foreignKey: 'cartId' }); // Asegúrate de usar el nombre del modelo correcto
  };



  return Users;
};

module.exports = getUsersModel;