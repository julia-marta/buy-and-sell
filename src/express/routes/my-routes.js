'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const privateRoute = require(`../middlewares/private-route`);
const myRouter = new Router();

const api = apiFactory.getAPI();

myRouter.get(`/`, privateRoute, async (req, res, next) => {
  try {
    const offers = await api.getOffers();
    res.render(`my/my-tickets`, {offers, myTicketsIsCurrent: true});
  } catch (err) {
    next(err);
  }
});

myRouter.get(`/comments`, privateRoute, async (req, res, next) => {
  try {
    const offers = await api.getOffers({comments: true});
    res.render(`my/comments`, {offers: offers.slice(0, 3), myCommentsIsCurrent: true});
  } catch (err) {
    next(err);
  }
});

module.exports = myRouter;
