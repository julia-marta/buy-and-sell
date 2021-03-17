'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (service, logger) => async (req, res, next) => {
  const {offerId} = req.params;
  const {comments = false} = req.query;

  const offer = await service.findOne(offerId, comments);

  if (!offer) {
    res.status(HttpCode.NOT_FOUND).send(`Offer with ${offerId} not found`);
    return logger.error(`Offer not found: ${offerId}`);
  }

  res.locals.offer = offer;
  return next();
};
