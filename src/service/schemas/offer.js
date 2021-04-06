'use strict';

const Joi = require(`joi`);
const {OfferMessage, Type, Text, Title, MIN_PRICE, MIN_CATEGORIES_LENGTH} = require(`../../const`);

module.exports = (categories) => {
  return Joi.object({

    picture: Joi.string()
    .empty(``)
    .required(),

    sum: Joi.number()
    .min(MIN_PRICE)
    .required()
    .messages({
      'any.required': OfferMessage.REQUIRED.PRICE,
      'number.min': OfferMessage.MIN_PRICE,
    }),

    type: Joi.string()
    .valid(Type.OFFER, Type.SALE)
    .empty(``)
    .required()
    .messages({
      'any.required': OfferMessage.REQUIRED.TYPE,
      'any.only': OfferMessage.VALID.TYPE
    }),

    description: Joi.string()
    .min(Text.MIN_LENGTH)
    .max(Text.MAX_LENGTH)
    .empty(``)
    .required()
    .messages({
      'string.min': OfferMessage.MIN_TEXT_LENGTH,
      'string.max': OfferMessage.MAX_TEXT_LENGTH,
      'any.required': OfferMessage.REQUIRED.TEXT,
    }),

    title: Joi.string()
    .min(Title.MIN_LENGTH)
    .max(Title.MAX_LENGTH)
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
    .min(MIN_CATEGORIES_LENGTH)
    .required()
    .messages({
      'any.required': OfferMessage.REQUIRED.CATEGORIES,
      'array.min': OfferMessage.REQUIRED.CATEGORIES,
      'array.base': OfferMessage.VALID.CATEGORIES,
      'any.only': OfferMessage.VALID.CATEGORIES
    }),
  });
};
