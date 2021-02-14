'use strict';

const {Router} = require(`express`);
const categories = require(`../api/categories`);
const offers = require(`../api/offers`);
const search = require(`../api/search`);
const getMockData = require(`../lib/get-mock-data`);

const {CategoryService, OfferService, CommentService, SearchService} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoryService(mockData));
  offers(app, new OfferService(mockData), new CommentService());
  search(app, new SearchService(mockData));

})();

module.exports = app;

