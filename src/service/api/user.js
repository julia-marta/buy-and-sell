'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`userService`);

  app.use(`/user`, route);

  route.post(`/`, async (req, res) => {
    const user = await service.add(req.body);

    return res.status(HttpCode.CREATED).json(user);
  });

  return route;
};
