'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const {getRandomInt} = require(`../../utils`);
const {CategoryImageName, OFFERS_PER_PAGE} = require(`../../const`);
const mainRouter = new Router();

const api = apiFactory.getAPI();
const csrfProtection = csrf({
  value: (req) => {
    return req.body.csrf;
  }});

mainRouter.get(`/`, async (req, res, next) => {

  const limit = OFFERS_PER_PAGE;

  try {
    const [lastOffers, popularOffers, categories] = await Promise.all([
      api.getOffers({limit, last: true}),
      api.getOffers({limit, popular: true}),
      api.getCategories({count: true})
    ]);

    const images = Array(categories.length).fill().map(() => (
      getRandomInt(CategoryImageName.MIN, CategoryImageName.MAX)
    ));

    res.render(`main`, {lastOffers, popularOffers, categories, images});
  } catch (err) {

    next(err);
  }
});

mainRouter.get(`/register`, csrfProtection, async (req, res) => {

  const {user = null, errorMessages = null} = req.session;

  const csrfToken = req.csrfToken();

  req.session.user = null;
  req.session.errorMessages = null;
  res.render(`sign-up`, {user, errorMessages, csrfToken});

});

mainRouter.post(`/register`, upload.single(`avatar`), csrfProtection, async (req, res) => {

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

mainRouter.get(`/login`, csrfProtection, async (req, res) => {

  const {userEmail = null, errorMessages = null} = req.session;

  const csrfToken = req.csrfToken();

  req.session.userEmail = null;
  req.session.errorMessages = null;
  res.render(`login`, {userEmail, errorMessages, csrfToken});

});

mainRouter.post(`/login`, upload.single(`avatar`), csrfProtection, async (req, res) => {

  const {body} = req;

  const loginData = {
    email: body[`user-email`],
    password: body[`user-password`],
  };

  try {
    const loggedUser = await api.loginUser(loginData);
    req.session.isLogged = true;
    req.session.loggedUser = loggedUser;
    return res.redirect(`/`);
  } catch (error) {
    req.session.userEmail = loginData.email;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/login`);
  }
});

mainRouter.get(`/logout`, async (req, res) => {
  req.session.destroy(() => {
    res.redirect(`/login`);
  });
});

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
