'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);

const {mockData} = require(`./search.test-data`);
const {HttpCode} = require(`../../const`);

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

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
  test(`First offer has correct id`, () => expect(response.body[0].id).toBe(`K1aM1D`));
  test(`Second offer has correct id`, () => expect(response.body[1].id).toBe(`BoIjCr`));

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
