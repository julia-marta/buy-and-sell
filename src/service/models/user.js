"use strict";

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

class User extends Model {}

const define = (sequelize) => User.init({
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});

const defineRelations = (models) => {

  const {Offer, Comment} = models;

  User.hasMany(Offer, {as: Aliase.OFFERS, foreignKey: `userId`});
  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
};

module.exports = {define, defineRelations};
