'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`searchService`);
  const logger = serviceLocator.get(`logger`);

  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return logger.error(`Invalid query.`);
    }

    const searchResults = await service.findAll(query);
    return res.status(HttpCode.OK).json(searchResults);
  });

  return route;
};
