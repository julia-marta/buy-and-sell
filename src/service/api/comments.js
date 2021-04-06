'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const schemaValidator = require(`../middlewares/schema-validator`);
const offerExists = require(`../middlewares/offer-exists`);
const commentSchema = require(`../schemas/comment`);

module.exports = (serviceLocator) => {
  const route = new Router({mergeParams: true});

  const app = serviceLocator.get(`app`);
  const offerService = serviceLocator.get(`offerService`);
  const commentService = serviceLocator.get(`commentService`);
  const logger = serviceLocator.get(`logger`);

  const isOfferExist = offerExists(offerService, logger);
  const isCommentValid = schemaValidator(commentSchema, logger);

  app.use(`/offers/:offerId/comments`, route);

  route.get(`/`, isOfferExist, async (req, res) => {
    const {offer} = res.locals;
    const comments = await commentService.findAll(offer.id);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:commentId`, isOfferExist, async (req, res) => {

    const {commentId} = req.params;
    const deleted = await commentService.drop(commentId);

    if (!deleted) {
      res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
      return logger.error(`Comment not found: ${commentId}`);
    }

    return res.status(HttpCode.OK).send(`Comment was deleted`);
  });

  route.post(`/`, [isOfferExist, isCommentValid], async (req, res) => {
    const {offer} = res.locals;
    const comment = await commentService.create(offer.id, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return route;
};
