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

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments = false} = req.query;
    let result;

    if (limit || offset) {
      result = await service.findPage({limit, offset});
    } else {
      result = await service.findAll(comments);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:offerId`, isOfferExist, (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, isOfferValid, async (req, res) => {
    const offer = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, [isOfferExist, isOfferValid], async (req, res) => {
    const {offerId} = req.params;

    await service.update(offerId, req.body);

    return res.status(HttpCode.OK).send(`Offer was updated`);
  });

  route.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const deleted = await service.drop(offerId);

    if (!deleted) {
      res.status(HttpCode.NOT_FOUND).send(`Offer with ${offerId} not found`);
      return logger.error(`Offer not found: ${offerId}`);
    }

    return res.status(HttpCode.OK).send(`Offer was deleted`);
  });

  return route;

};
