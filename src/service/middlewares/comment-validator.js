'use strict';

const {HttpCode} = require(`../../const`);

const commentKeys = [`text`];

module.exports = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const keysExists = commentKeys.every((key) => keys.includes(key));
  const keysValid = keys.every((key) => commentKeys.includes(key));

  if (!keysExists || !keysValid) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
