'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const privateRoute = require(`../middlewares/private-route`);
const myRouter = new Router();

const api = apiFactory.getAPI();

myRouter.get(`/`, privateRoute, async (req, res, next) => {
  const userId = req.session.loggedUser.id;

  try {
    const offers = await api.getOffers({userId});
    res.render(`my/my-tickets`, {offers, myTicketsIsCurrent: true});
  } catch (err) {
    next(err);
  }
});

myRouter.get(`/comments`, privateRoute, async (req, res, next) => {
  const userId = req.session.loggedUser.id;

  try {
    const offers = await api.getOffers({userId, comments: true});
    res.render(`my/comments`, {offers, myCommentsIsCurrent: true});
  } catch (err) {
    next(err);
  }
});

module.exports = myRouter;
