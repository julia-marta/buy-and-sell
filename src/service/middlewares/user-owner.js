'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (service, logger) => async (req, res, next) => {
  const {offerId} = req.params;
  const {userId} = req.query;

  const offer = await service.findOne(offerId);

  const offerBelongsToUser = Number(userId) === offer.userId;

  if (!offerBelongsToUser) {
    res.status(HttpCode.FORBIDDEN).send(`You are not allowed to change this offer`);
    return logger.error(`Offer ${offerId} not belongs to user ${userId}`);
  }

  return next();
};
