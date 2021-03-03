'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const myRouter = new Router();

const api = apiFactory.getAPI();

myRouter.get(`/`, async (req, res, next) => {
  try {
    const offers = await api.getOffers();
    res.render(`my/my-tickets`, {offers});
  } catch (err) {
    next(err);
  }
});

myRouter.get(`/comments`, async (req, res, next) => {
  try {
    const offers = await api.getOffers();
    res.render(`my/comments`, {offers: offers.slice(0, 3)});
  } catch (err) {
    next(err);
  }
});

module.exports = myRouter;
