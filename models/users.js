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
  });

  Users.associate = (models) => {
    Users.hasMany(models.Orders);
   // Users.belongsTo(models.cart);
  };

  

  return Users;
};

module.exports = getUsersModel;