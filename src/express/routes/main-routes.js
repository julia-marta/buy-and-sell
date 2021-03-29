'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const mainRouter = new Router();
const {getRandomInt, getPagerRange} = require(`../../utils`);
const {CategoryImageName} = require(`../../const`);

const OFFERS_PER_PAGE = 8;
const PAGER_WIDTH = 2;

const api = apiFactory.getAPI();

mainRouter.get(`/`, async (req, res, next) => {

  let {page = 1} = req.query;
  page = +page;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  try {
    const [{count, offers}, categories] = await Promise.all([
      api.getOffers({limit, offset}),
      api.getCategories({count: true})
    ]);

    const images = Array(categories.length).fill().map(() => (
      getRandomInt(CategoryImageName.MIN, CategoryImageName.MAX)
    ));

    const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
    const range = getPagerRange(page, totalPages, PAGER_WIDTH);
    const withPagination = totalPages > 1;

    res.render(`main`, {offers, categories, images, page, totalPages, range, withPagination});
  } catch (err) {

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
