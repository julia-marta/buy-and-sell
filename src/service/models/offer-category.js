"use strict";

const {Model} = require(`sequelize`);

class OfferCategory extends Model {}

const define = (sequelize) => OfferCategory.init({}, {
  sequelize,
  modelName: `OfferCategory`,
  tableName: `offer_categories`
});

module.exports = {define};
