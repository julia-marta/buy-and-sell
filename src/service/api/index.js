'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const offers = require(`../api/offers`);
const comments = require(`../api/comments`);
const search = require(`../api/search`);
const getMockData = require(`../lib/get-mock-data`);

const {CategoryService, OfferService, CommentService, SearchService} = require(`../data-service`);

module.exports = async (logger) => {
  const app = new Router();

  const mockData = await getMockData();
  const commentsRouter = comments(new CommentService(), logger);
  categories(app, new CategoryService(mockData));
  offers(app, new OfferService(mockData), commentsRouter, logger);
  search(app, new SearchService(mockData), logger);

  return app;
};
