'use strict';

const {HttpCode} = require(`../../const`);

const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = (logger) => (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keysExists = offerKeys.every((key) => keys.includes(key));
  const keysValid = keys.every((key) => offerKeys.includes(key));

  if (!keysExists || !keysValid) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);

    if (!keysExists) {
      const missedKeys = offerKeys.filter((key) => !keys.includes(key));
      return logger.error(`Offer not valid. Required properties: ${missedKeys}.`);
    } else {
      const excessKeys = keys.filter((key) => !offerKeys.includes(key));
      return logger.error(`Offer not valid. Invalid properties: ${excessKeys}.`);
    }
  }

  return next();
};
