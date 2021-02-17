'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    res.status(HttpCode.OK).json(service.findAll(query));
  });
};
