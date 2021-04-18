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

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;

    const category = await service.findOne(id);

    return res.status(HttpCode.OK).json(category);
  });

  return route;
};
