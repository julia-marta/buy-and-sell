'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const offers = require(`../api/offers`);
const comments = require(`../api/comments`);
const search = require(`../api/search`);
const getMockData = require(`../lib/get-mock-data`);
const serviceLocator = require(`../lib/service-locator`)();

const {CategoryService, OfferService, CommentService, SearchService} = require(`../data-service`);

module.exports = async (logger) => {
  const app = new Router();

  const mockData = await getMockData();

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`categoryService`, new CategoryService(mockData));
  serviceLocator.register(`offerService`, new OfferService(mockData));
  serviceLocator.register(`commentService`, new CommentService());
  serviceLocator.register(`searchService`, new SearchService(mockData));

  serviceLocator.factory(`categories`, categories);
  serviceLocator.factory(`offers`, offers);
  serviceLocator.factory(`comments`, comments);
  serviceLocator.factory(`search`, search);

  serviceLocator.get(`categories`);
  serviceLocator.get(`offers`);
  serviceLocator.get(`comments`);
  serviceLocator.get(`search`);

  return app;
};
