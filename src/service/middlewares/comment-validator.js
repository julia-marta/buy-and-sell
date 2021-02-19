'use strict';

const {HttpCode} = require(`../../const`);

const commentKeys = [`text`];

module.exports = (logger) => (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const keysExists = commentKeys.every((key) => keys.includes(key));
  const keysValid = keys.every((key) => commentKeys.includes(key));

  if (!keysExists || !keysValid) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);

    if (!keysExists) {
      const missedKeys = commentKeys.filter((key) => !keys.includes(key));
      return logger.error(`Comment not valid. Required properties: ${missedKeys}.`);
    } else {
      const excessKeys = keys.filter((key) => !commentKeys.includes(key));
      return logger.error(`Comment not valid. Invalid properties: ${excessKeys}.`);
    }
  }

  return next();
};
