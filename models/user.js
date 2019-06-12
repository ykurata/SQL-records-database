'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Username is required!"
        }
      },
      unique: {
        args: true,
        msg: 'Username already in use!'
      }
    },
    email:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email Address is required!"
        }
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
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
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
