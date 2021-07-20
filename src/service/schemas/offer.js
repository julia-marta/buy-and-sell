'use strict';

const Joi = require(`joi`);
const {Offer, OfferMessage} = require(`../../const`);

module.exports = (categories) => {
  return Joi.object({

    picture: Joi.string()
    .empty(``)
    .required(),

    sum: Joi.number()
    .min(Offer.MIN_PRICE)
    .required()
    .messages({
      'any.required': OfferMessage.REQUIRED.PRICE,
      'number.min': OfferMessage.MIN_PRICE,
    }),

    type: Joi.string()
    .valid(Offer.TYPE.OFFER, Offer.TYPE.SALE)
    .empty(``)
    .required()
    .messages({
      'any.required': OfferMessage.REQUIRED.TYPE,
      'any.only': OfferMessage.VALID.TYPE
    }),

    description: Joi.string()
    .min(Offer.MIN_TEXT_LENGTH)
    .max(Offer.MAX_TEXT_LENGTH)
    .empty(``)
    .required()
    .messages({
      'string.min': OfferMessage.MIN_TEXT_LENGTH,
      'string.max': OfferMessage.MAX_TEXT_LENGTH,
      'any.required': OfferMessage.REQUIRED.TEXT,
    }),

    title: Joi.string()
    .min(Offer.MIN_TITLE_LENGTH)
    .max(Offer.MAX_TITLE_LENGTH)
    .empty(``)
    .required()
    .messages({
      'string.min': OfferMessage.MIN_TITLE_LENGTH,
      'string.max': OfferMessage.MAX_TITLE_LENGTH,
      'any.required': OfferMessage.REQUIRED.TITLE,
    }),

    categories: Joi.array()
    .items(Joi.number()
    .valid(...categories))
    .min(Offer.MIN_CATEGORIES_LENGTH)
    .required()
    .messages({
      'any.required': OfferMessage.REQUIRED.CATEGORIES,
      'array.min': OfferMessage.REQUIRED.CATEGORIES,
      'array.base': OfferMessage.VALID.CATEGORIES,
      'any.only': OfferMessage.VALID.CATEGORIES
    }),
  });
};
