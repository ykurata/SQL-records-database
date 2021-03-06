'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    artist: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Artist Name is required!"
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Album Title is required!"
        }
      }
    },
    genre: DataTypes.STRING,
    speed: DataTypes.INTEGER,
    sideA: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "Please enter the songs in Side A"
        }
      }
    },
    sideB: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "Please enter the songs in Side B"
        }
      }
    }
  }, {});
  Record.associate = function(models) {
    // associations can be defined here
  };
  return Record;
};
