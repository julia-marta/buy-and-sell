'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const mainRouter = new Router();
const {getRandomInt} = require(`../../utils`);
const {CategoryImageName} = require(`../../const`);

const api = apiFactory.getAPI();

mainRouter.get(`/`, async (req, res, next) => {

  try {
    const [offers, categories] = await Promise.all([
      api.getOffers(),
      api.getCategories({count: true})
    ]);

    const images = Array(categories.length).fill().map(() => (
      getRandomInt(CategoryImageName.MIN, CategoryImageName.MAX)
    ));

    res.render(`main`, {offers, categories, images});
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
