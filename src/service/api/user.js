'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const userAlreadyExists = require(`../middlewares/user-already-exists`);
const authenticate = require(`../middlewares/authenticate`);
const schemaValidator = require(`../middlewares/schema-validator`);
const userSchema = require(`../schemas/user`);
const loginSchema = require(`../schemas/login`);

module.exports = (serviceLocator) => {
  const route = new Router();

  const app = serviceLocator.get(`app`);
  const service = serviceLocator.get(`userService`);
  const logger = serviceLocator.get(`logger`);

  const isUserAlreadyExists = userAlreadyExists(service, logger);
  const isUserValid = schemaValidator(userSchema, logger);
  const isLoginDataValid = schemaValidator(loginSchema, logger);
  const isLoginDataExists = authenticate(service, logger);

  app.use(`/user`, route);

  route.post(`/`, [isUserValid, isUserAlreadyExists], async (req, res) => {
    const user = await service.add(req.body);

    return res.status(HttpCode.CREATED).json(user);
  });

  route.post(`/login`, [isLoginDataValid, isLoginDataExists], async (req, res) => {

    const {user} = res.locals;

    return res.status(HttpCode.OK).json(user);
  });

  return route;
};
