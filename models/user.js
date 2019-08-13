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
      }
    },
    email:{
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email Address is required!"
        },
        isUnique(value, next) {
          User.findOne({
            where: { email: value },
            attributes: ['id']
          }).done((user) => {
            if (user)
              return next("Email address already exists!");

            next();
          });
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
    // confrimPassword :{
    //   type: DataTypes.STRING,
    //   validate: {
    //     notEmpty: {
    //       msg: "Confrim Password is required!"
    //     }
    //   }
    // }
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
