'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExists = require(`../middlewares/offer-exists`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`offerService`);
  const logger = serviceLocator.get(`logger`);

  const isOfferExist = offerExists(service, logger);
  const isOfferValid = offerValidator(logger);

  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();

    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, isOfferExist, (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, isOfferValid, (req, res) => {
    const offer = service.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, [isOfferExist, isOfferValid], (req, res) => {
    const {offerId} = req.params;

    const updatedOffer = service.update(offerId, req.body);

    return res.status(HttpCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const deletedOffer = service.drop(offerId);

    if (!deletedOffer) {
      res.status(HttpCode.NOT_FOUND).send(`Offer with ${offerId} not found`);
      return logger.error(`Offer not found: ${offerId}`);
    }

    return res.status(HttpCode.OK).json(deletedOffer);
  });

  return route;

};
