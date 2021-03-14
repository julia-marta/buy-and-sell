'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const {getLogger} = require(`../lib/test-logger`);
const {mockOffers, mockCategories} = require(`./search.test-data`);
const {HttpCode} = require(`../../const`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const serviceLocator = serviceLocatorFactory();
const app = express();
const logger = getLogger();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`searchService`, new DataService(mockDB));
  serviceLocator.factory(`search`, search);
  serviceLocator.get(`search`);
});


describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`)
      .query({
        query: `Куплю породистого кота`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`2 offers found`, () => expect(response.body.length).toBe(2));
  test(`First offer has correct sum`, () => expect(response.body[0].sum).toBe(83497));
  test(`Second offer has correct sum`, () => expect(response.body[1].sum).toBe(6659));

});

test(`API returns empty array if nothing is found`, async () => {
  const res = await request(app).get(`/search`)
     .query({
       query: `Куплю породистого слона`
     });

  expect(res.body.length).toBe(0);
});

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);
