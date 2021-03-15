'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`categoryService`);

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count = false} = req.query;
    let categories;

    if (count) {
      categories = await service.findAllWithCount();
    } else {
      categories = await service.findAll();
    }

    return res.status(HttpCode.OK).json(categories);
  });

  return route;
};
