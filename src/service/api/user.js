'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const userAlreadyExists = require(`../middlewares/user-already-exists`);
const schemaValidator = require(`../middlewares/schema-validator`);
const userSchema = require(`../schemas/user`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`userService`);
  const logger = serviceLocator.get(`logger`);

  const isUserAlreadyExists = userAlreadyExists(service, logger);
  const isUserValid = schemaValidator(userSchema, logger);

  app.use(`/user`, route);

  route.post(`/`, [isUserValid, isUserAlreadyExists], async (req, res) => {
    const user = await service.add(req.body);

    return res.status(HttpCode.CREATED).json(user);
  });

  return route;
};
