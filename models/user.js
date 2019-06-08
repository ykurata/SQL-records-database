'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username:{
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Username is required!"
        }
      }
    },
    email:{
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Email Address is required!"
        }
      }
    },
    password:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Password is required!"
        }
      }
    },
    confrimPassword :{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Confrim Password is required!"
        }
      }
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
