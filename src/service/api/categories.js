'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpCode.OK).json(categories);
  });
};
