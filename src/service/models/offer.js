"use strict";

const {DataTypes, Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

class Offer extends Model {}

const define = (sequelize) => Offer.init({
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: DataTypes.STRING,
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sum: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Offer`,
  tableName: `offers`
});

const defineRelations = (models) => {

  const {Comment, Category, OfferCategory} = models;

  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES});
};

module.exports = {define, defineRelations};
