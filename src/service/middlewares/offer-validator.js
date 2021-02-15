'use strict';

const {HttpCode} = require(`../../const`);

const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));
  const keysValid = keys.every((key) => offerKeys.includes(key));

  if (!keysExists || !keysValid) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
