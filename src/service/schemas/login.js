'use strict';

const Joi = require(`joi`);
const {LoginMessage} = require(`../../const`);

module.exports = Joi.object({

  email: Joi.string()
    .email()
    .empty(``)
    .required()
    .messages({
      'string.email': LoginMessage.EMAIL_NOT_VALID,
      'any.required': LoginMessage.REQUIRED.EMAIL,
    }),

  password: Joi.string()
    .empty(``)
    .required()
    .messages({
      'any.required': LoginMessage.REQUIRED.PASSWORD,
    }),
});
