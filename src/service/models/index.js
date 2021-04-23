"use strict";

const CategoryModel = require(`./category`);
const CommentModel = require(`./comment`);
const OfferModel = require(`./offer`);
const OfferCategoryModel = require(`./offer-category`);
const UserModel = require(`./user`);

const define = (sequelize) => {

  const Category = CategoryModel.define(sequelize);
  const Comment = CommentModel.define(sequelize);
  const Offer = OfferModel.define(sequelize);
  const OfferCategory = OfferCategoryModel.define(sequelize);
  const User = UserModel.define(sequelize);

  const models = [CategoryModel, CommentModel, OfferModel, UserModel];

  models.forEach((model) => model.defineRelations({Comment, Category, OfferCategory, Offer, User}));

  return {Category, Comment, Offer, OfferCategory, User};
};

module.exports = define;
