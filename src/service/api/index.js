'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const offers = require(`../api/offers`);
const comments = require(`../api/comments`);
const search = require(`../api/search`);
const getMockData = require(`../lib/get-mock-data`);

const {CategoryService, OfferService, CommentService, SearchService} = require(`../data-service`);

module.exports = async () => {
  const app = new Router();

  try {
    const mockData = await getMockData();
    const commentsRouter = comments(new CommentService());
    categories(app, new CategoryService(mockData));
    offers(app, new OfferService(mockData), commentsRouter);
    search(app, new SearchService(mockData));
  } catch (err) {
    throw err;
  }

  return app;
};
