'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  async findAllWithCount() {
    const result = await this._Category.findAll({
      attributes: [
        `id`,
        `name`,
        [
          Sequelize.fn(
              `COUNT`,
              `*`
          ),
          `count`
        ]
      ],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._OfferCategory,
        as: Aliase.OFFER_CATEGORIES,
        attributes: []
      }]
    });

    return result.map((it) => it.get());
  }

  async findOne(id) {
    return this._Category.findByPk(id);
  }

  async findAll() {
    return this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
