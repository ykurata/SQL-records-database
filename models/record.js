'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    artist: DataTypes.STRING,
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    sideA: DataTypes.TEXT,
    sideB: DataTypes.TEXT,
    speed: DataTypes.INTEGER
  }, {});
  Record.associate = function(models) {
    // associations can be defined here
  };
  return Record;
};
