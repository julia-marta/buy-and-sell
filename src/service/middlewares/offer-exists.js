'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (service, logger) => (req, res, next) => {
  const {offerId} = req.params;
  const offer = service.findOne(offerId);

  if (!offer) {
    res.status(HttpCode.NOT_FOUND).send(`Offer with ${offerId} not found`);
    return logger.error(`Offer not found: ${offerId}`);
  }

  res.locals.offer = offer;
  return next();
};
