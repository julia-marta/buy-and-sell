'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`categoryService`);

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });

  return route;
};
