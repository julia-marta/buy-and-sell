'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const {getRandomInt, getPagerRange} = require(`../../utils`);
const {CategoryImageName} = require(`../../const`);
const mainRouter = new Router();

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

mainRouter.get(`/register`, async (req, res) => {

  const {user = null, errorMessages = null} = req.session;

  req.session.user = null;
  req.session.errorMessages = null;
  res.render(`sign-up`, {user, errorMessages});

});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {

  const {body, file} = req;

  const userData = {
    firstname: body[`user-name`].split(` `)[0],
    lastname: body[`user-name`].split(` `)[1],
    email: body[`user-email`],
    password: body[`user-password`],
    repeat: body[`user-password-again`],
    avatar: file ? file.filename : ``
  };

  try {
    await api.createUser(userData);
    return res.redirect(`/login`);
  } catch (error) {
    req.session.user = userData;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/register`);
  }
});

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
