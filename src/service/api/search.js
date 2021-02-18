'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

module.exports = (app, service, logger) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return logger.error(`Invalid query.`);
    }

    return res.status(HttpCode.OK).json(service.findAll(query));
  });
};
