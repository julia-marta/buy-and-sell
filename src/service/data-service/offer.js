'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
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

  async findPage({limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES],
      distinct: true
    });

    return {count, offers: rows};
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
