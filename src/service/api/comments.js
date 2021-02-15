'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (commentService) => {
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
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });

  route.post(`/`, commentValidator, (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return route;
};
