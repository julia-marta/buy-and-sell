'use strict';

const {Router} = require(`express`);
const schemaValidator = require(`../middlewares/schema-validator`);
const offerExists = require(`../middlewares/offer-exists`);
const userOwner = require(`../middlewares/user-owner`);
const offerSchema = require(`../schemas/offer`);
const {HttpCode, OFFERS_PER_PAGE} = require(`../../const`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`offerService`);
  const categoryService = serviceLocator.get(`categoryService`);
  const logger = serviceLocator.get(`logger`);
  const socketService = serviceLocator.get(`socketService`);

  const isOfferExist = offerExists(service, logger);
  const isOfferValid = schemaValidator(offerSchema, logger, categoryService);
  const isOfferBelongsToUser = userOwner(service, logger);

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {

    const offers = await service.findAll();

    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/popular`, async (req, res) => {
    const {limit} = req.query;

    const popularOffers = await service.findPopular(limit);

    return res.status(HttpCode.OK).json(popularOffers);
  });

  route.get(`/last`, async (req, res) => {
    const {limit} = req.query;

    const lastOffers = await service.findLast(limit);

    return res.status(HttpCode.OK).json(lastOffers);
  });

  route.get(`/user`, async (req, res) => {
    const {userId, comments = false} = req.query;

    const userOffers = await service.findAllByUser(userId, comments);

    return res.status(HttpCode.OK).json(userOffers);
  });

  route.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {offset, limit} = req.query;
    let result;

    result = (limit || offset) ? await service.findPageByCategory({limit, offset, categoryId}) : await service.findAllByCategory(categoryId);

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:offerId`, isOfferExist, (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, isOfferValid, async (req, res) => {
    const {userId} = req.query;

    const offer = await service.create(userId, req.body);
    const updatedLastOffers = await service.findLast(OFFERS_PER_PAGE);

    socketService.updateLast(updatedLastOffers);

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
    const updatedLastOffers = await service.findLast(OFFERS_PER_PAGE);

    socketService.updateLast(updatedLastOffers);

    return res.status(HttpCode.OK).send(`Offer was deleted`);
  });

  return route;

};
