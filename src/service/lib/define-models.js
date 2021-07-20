"use strict";

const {CategoryModel, CommentModel, OfferModel, OfferCategoryModel, UserModel} = require(`../models`);

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
