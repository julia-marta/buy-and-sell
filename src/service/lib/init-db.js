"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {offers, categories}) => {
  const {Category, Offer} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, item) => ({
    [item.name]: item.id,
    ...acc
  }), {});

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
    await offerModel.addCategories(
        offer.categories.map((category) => categoryIdByName[category])
    );
  });
  await Promise.all(offerPromises);
};
