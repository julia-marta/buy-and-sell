'use strict';

const Joi = require(`joi`);
const {Comment, CommentMessage} = require(`../../const`);

module.exports = Joi.object({

  text: Joi.string()
    .min(Comment.MIN_LENGTH)
    .max(Comment.MAX_LENGTH)
    .empty(``)
    .required()
    .messages({
      'string.min': CommentMessage.MIN_TEXT_LENGTH,
      'string.max': CommentMessage.MAX_TEXT_LENGTH,
      'any.required': CommentMessage.REQUIRED,
    }),
});
