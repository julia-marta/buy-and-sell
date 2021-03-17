"use strict";

const CategoryModel = require(`./category`);
const CommentModel = require(`./comment`);
const OfferModel = require(`./offer`);
const OfferCategoryModel = require(`./offer-category`);

const define = (sequelize) => {

  const Category = CategoryModel.define(sequelize);
  const Comment = CommentModel.define(sequelize);
  const Offer = OfferModel.define(sequelize);
  const OfferCategory = OfferCategoryModel.define(sequelize);

  const models = [CategoryModel, CommentModel, OfferModel];

  models.forEach((model) => model.defineRelations({Comment, Category, OfferCategory, Offer}));

  return {Category, Comment, Offer, OfferCategory};
};

module.exports = define;
