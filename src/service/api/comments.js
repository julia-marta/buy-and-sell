'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExists = require(`../middlewares/offer-exists`);

module.exports = (serviceLocator) => {
  const route = new Router({mergeParams: true});

  const app = serviceLocator.get(`app`);
  const offerService = serviceLocator.get(`offerService`);
  const commentService = serviceLocator.get(`commentService`);
  const logger = serviceLocator.get(`logger`);

  const isOfferExist = offerExists(offerService, logger);

  app.use(`/offers/:offerId/comments`, route);

  route.get(`/`, isOfferExist, (req, res) => {
    const {offer} = res.locals;
    const comments = commentService.findAll(offer);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:commentId`, isOfferExist, (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(offer, commentId);

    if (!deletedComment) {
      res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
      return logger.error(`Comment not found: ${commentId}`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });

  route.post(`/`, [isOfferExist, commentValidator(logger)], (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return route;
};
