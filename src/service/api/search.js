'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    const searchResults = service.findAll(query);

    if (searchResults.length <= 0) {
      res.status(HttpCode.OK).send(`No results`);
      return;
    }

    res.status(HttpCode.OK).json(searchResults);
  });
};
