'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const privateRoute = require(`../middlewares/private-route`);
const myRouter = new Router();

const api = apiFactory.getAPI();

myRouter.get(`/`, privateRoute, async (req, res, next) => {
  const userId = req.session.loggedUser.id;

  try {
    const offers = await api.getUserOffers({userId});
    res.render(`my/my-tickets`, {offers, myTicketsIsCurrent: true});
  } catch (err) {
    next(err);
  }
});

myRouter.post(`/:offerId`, privateRoute, async (req, res, next) => {

  const {offerId} = req.params;
  const userId = req.session.loggedUser.id;

  try {
    await api.deleteOffer(offerId, userId);
    res.redirect(`back`);
  } catch (err) {
    next(err);
  }
});

myRouter.get(`/comments`, privateRoute, async (req, res, next) => {
  const userId = req.session.loggedUser.id;

  try {
    const offers = await api.getUserOffers({userId, comments: true});
    res.render(`my/comments`, {offers, myCommentsIsCurrent: true});
  } catch (err) {
    next(err);
  }
});

myRouter.post(`/:offerId/comments/:id`, privateRoute, async (req, res, next) => {

  const {offerId, id} = req.params;
  const userId = req.session.loggedUser.id;

  try {
    await api.deleteComment(id, offerId, userId);
    res.redirect(`back`);
  } catch (err) {
    next(err);
  }
});

module.exports = myRouter;
