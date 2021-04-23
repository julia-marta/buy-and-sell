'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
    this._sequelize = sequelize;
  }

  async create(userId, offerData) {
    const offer = await this._Offer.create({userId, ...offerData});
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });

    const updatedOffer = await this._Offer.findByPk(id);
    await updatedOffer.setCategories(offer.categories);

    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll() {

    const offers = await this._Offer.findAll({include: [Aliase.CATEGORIES]});

    return offers.map((offer) => offer.get());
  }

  async findLast(limit) {

    const offers = await this._Offer.findAll({
      limit,
      include: [Aliase.CATEGORIES],
      distinct: true,
      order: [[`createdAt`, `DESC`]]
    });

    return offers.map((offer) => offer.get());
  }

  async findPopular(limit) {

    const offers = await this._sequelize.query(`
    SELECT offers.id, picture, title, sum, type, description, offers."createdAt",
      jsonb_agg(DISTINCT jsonb_build_object('id', categories.id, 'name', categories.name)) AS categories,
      count(DISTINCT comments.id) AS "commentsCount"
    FROM offers
      JOIN offer_categories ON offers.id = offer_categories."OfferId"
      JOIN categories ON offer_categories."CategoryId" = categories.id
      LEFT JOIN comments ON comments."offerId" = offers.id
      GROUP BY offers.id
      ORDER BY "commentsCount" DESC
      LIMIT ${limit}
    `, {type: Sequelize.QueryTypes.SELECT});

    return offers;
  }

  async findOne(id, withComments) {
    const include = [Aliase.CATEGORIES, Aliase.USERS];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [Aliase.USERS],
      });
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

  async findAllByUser(id, withComments) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [Aliase.USERS],
      });
    }

    const offers = await this._Offer.findAll({
      include,
      where: {userId: id},
      order: [[`createdAt`, `DESC`]]
    });

    return offers.map((offer) => offer.get());
  }
}

module.exports = OfferService;
