'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (commentService, logger) => {
  const route = new Router({mergeParams: true});

  route.get(`/`, (req, res) => {
    const {offer} = res.locals;
    const comments = commentService.findAll(offer);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:commentId`, (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(offer, commentId);

    if (!deletedComment) {
      res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
      return logger.error(`Comment not found: ${commentId}`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });

  route.post(`/`, commentValidator(logger), (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return route;
};
