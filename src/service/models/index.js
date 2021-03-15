"use strict";

const {defineCategory, defineCategoryRelations} = require(`./category`);
const {defineComment, defineCommentRelations} = require(`./comment`);
const {defineOffer, defineOfferRelations} = require(`./offer`);
const defineOfferCategory = require(`./offer-category`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const OfferCategory = defineOfferCategory(sequelize);

  defineOfferRelations(Comment, Category, OfferCategory);
  defineCommentRelations(Offer);
  defineCategoryRelations(Offer, OfferCategory);

  return {Category, Comment, Offer, OfferCategory};
};

module.exports = define;
