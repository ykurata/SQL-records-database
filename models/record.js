'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    artist: DataTypes.STRING,
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    speed: DataTypes.INTEGER,
    sideA: DataTypes.TEXT,
    sideB: DataTypes.TEXT
  }, {});
  Record.associate = function(models) {
    // associations can be defined here
  };
  return Record;
};