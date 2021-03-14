'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const mainRouter = new Router();

const api = apiFactory.getAPI();

mainRouter.get(`/`, async (req, res, next) => {
  try {
    const [offers, categories] = await Promise.all([
      api.getOffers(),
      api.getCategories(true)
    ]);

    res.render(`main`, {offers, categories});
  } catch (err) {
    console.log(err);
    next(err);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  let results;

  try {
    results = await api.search(search);
  } catch (error) {
    results = [];
  }

  res.render(`search-result`, {results, search});
});

module.exports = mainRouter;
