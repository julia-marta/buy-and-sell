"use strict";

const defineModels = require(`../models`);

module.exports = async (sequelize, {offers, categories, users, comments}) => {
  const {Category, Offer, User, Comment} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, item) => ({
    [item.name]: item.id,
    ...acc
  }), {});

  await User.bulkCreate(users);

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Offer.create(offer);
    await offerModel.addCategories(
        offer.categories.map((category) => categoryIdByName[category])
    );
  });
  await Promise.all(offerPromises);

  await Comment.bulkCreate(comments);
};
