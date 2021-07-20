'use strict';

const {Router} = require(`express`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const sequelize = require(`../lib/sequelize`);
const SocketService = require(`../lib/socket-service`);
const defineModels = require(`../lib/define-models`);
const {categoriesRoute, offersRoute, commentsRoute, searchRoute, userRoute} = require(`../api`);
const {CategoryService, OfferService, CommentService, SearchService, UserService} = require(`../data-service`);

module.exports = async (logger, server) => {

  const app = new Router();
  const serviceLocator = serviceLocatorFactory();

  defineModels(sequelize);

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`socketService`, new SocketService(server));
  serviceLocator.register(`categoryService`, new CategoryService(sequelize));
  serviceLocator.register(`offerService`, new OfferService(sequelize));
  serviceLocator.register(`commentService`, new CommentService(sequelize));
  serviceLocator.register(`searchService`, new SearchService(sequelize));
  serviceLocator.register(`userService`, new UserService(sequelize));

  serviceLocator.factory(`categories`, categoriesRoute);
  serviceLocator.factory(`offers`, offersRoute);
  serviceLocator.factory(`comments`, commentsRoute);
  serviceLocator.factory(`search`, searchRoute);
  serviceLocator.factory(`user`, userRoute);

  serviceLocator.get(`categories`);
  serviceLocator.get(`offers`);
  serviceLocator.get(`comments`);
  serviceLocator.get(`search`);
  serviceLocator.get(`user`);

  return app;
};
