'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExists = require(`../middlewares/offer-exists`);

const route = new Router();

module.exports = (app, offerService, commentsRouter) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();

    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, offerExists(offerService), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, [offerExists(offerService), offerValidator], (req, res) => {
    const {offerId} = req.params;

    const updatedOffer = offerService.update(offerId, req.body);

    return res.status(HttpCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const deletedOffer = offerService.drop(offerId);

    if (!deletedOffer) {
      return res.status(HttpCode.NOT_FOUND).send(`Offer with ${offerId} not found`);
    }

    return res.status(HttpCode.OK).json(deletedOffer);
  });

  route.use(`/:offerId/comments`, offerExists(offerService), commentsRouter);
};
