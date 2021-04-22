'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const schemaValidator = require(`../middlewares/schema-validator`);
const offerExists = require(`../middlewares/offer-exists`);
const userOwner = require(`../middlewares/user-owner`);
const offerSchema = require(`../schemas/offer`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`offerService`);
  const categoryService = serviceLocator.get(`categoryService`);
  const logger = serviceLocator.get(`logger`);

  const isOfferExist = offerExists(service, logger);
  const isOfferValid = schemaValidator(offerSchema, logger, categoryService);
  const isOfferBelongsToUser = userOwner(service, logger);

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {limit, popular, last, userId, comments = false} = req.query;

    let result;

    if (popular) {
      result = await service.findPopular(limit);
    } else if (last) {
      result = await service.findLast(limit);
    } else if (userId) {
      result = await service.findAllByUser(userId, comments);
    } else {
      result = await service.findAll();
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {offset, limit} = req.query;
    let result;

    if (limit || offset) {
      result = await service.findPageByCategory({limit, offset, categoryId});
    } else {
      result = await service.findAllByCategory(categoryId);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:offerId`, isOfferExist, (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, isOfferValid, async (req, res) => {
    const {userId} = req.query;

    const offer = await service.create(userId, req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, [isOfferExist, isOfferValid], async (req, res) => {
    const {offerId} = req.params;

    await service.update(offerId, req.body);

    return res.status(HttpCode.OK).send(`Offer was updated`);
  });

  route.delete(`/:offerId`, [isOfferExist, isOfferBelongsToUser], async (req, res) => {
    const {offerId} = req.params;

    await service.drop(offerId);

    return res.status(HttpCode.OK).send(`Offer was deleted`);
  });

  return route;

};
