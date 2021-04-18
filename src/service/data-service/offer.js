'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
    }

    const offers = await this._Offer.findAll({include});

    return offers.map((offer) => offer.get());
  }

  async findOne(id, withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
    }

    return this._Offer.findByPk(id, {include});
  }

  async findPageByCategory({limit, offset, categoryId}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, {
        model: this._OfferCategory,
        as: Aliase.OFFER_CATEGORIES,
        attributes: [],
        require: true,
        where: {CategoryId: categoryId}
      }],
      distinct: true,
      order: [[`createdAt`, `DESC`]]
    });

    return {count, offers: rows.map((item) => item.get())};
  }

  async findAllByCategory(categoryId) {

    const offers = await this._Offer.findAll({
      include: [Aliase.CATEGORIES, {
        model: this._OfferCategory,
        as: Aliase.OFFER_CATEGORIES,
        attributes: [],
        require: true,
        where: {CategoryId: categoryId}
      }],
      order: [[`createdAt`, `DESC`]]
    });

    return offers.map((offer) => offer.get());
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });

    const updatedOffer = await this._Offer.findByPk(id);
    await updatedOffer.setCategories(offer.categories);

    return !!affectedRows;
  }
}

module.exports = OfferService;
