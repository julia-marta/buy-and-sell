"use strict";

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

const defineRelations = (models) => {

  const {Offer, User} = models;

  Comment.belongsTo(Offer, {foreignKey: `offerId`, as: Aliase.OFFERS});
  Comment.belongsTo(User, {foreignKey: `userId`, as: Aliase.USERS});
};

module.exports = {define, defineRelations};
