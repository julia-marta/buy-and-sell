'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offers = require(`./offers`);
const DataService = require(`../data-service/offer`);

const {mockData, mockOffer} = require(`./offers.test-data`);
const {HttpCode} = require(`../../const`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  const mockRouter = jest.fn();
  app.use(express.json());
  offers(app, new DataService(cloneData), mockRouter);

  return app;
};

describe(`API returns a list of all offers`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 offers`, () => expect(response.body.length).toBe(4));
  test(`First offer's id equals "U9cyX7"`, () => expect(response.body[0].id).toBe(`U9cyX7`));
});

describe(`API returns an offer with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/ORNXNO`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Продам отличную подборку фильмов на VHS."`, () => expect(response.body.title).toBe(`Продам отличную подборку фильмов на VHS.`));
});

describe(`API creates an offer if data is valid`, () => {

  const newOffer = JSON.parse(JSON.stringify(mockOffer));

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(newOffer);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offers count is changed`, () => request(app).get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {

  const newOffer = JSON.parse(JSON.stringify(mockOffer));

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];

      await request(app).post(`/offers`).send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`With any additional excess property response code is 400`, async () => {

    const badOffer = {...newOffer};
    badOffer.excess = `excess value`;

    await request(app).post(`/offers`).send(badOffer)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API changes existent offer`, () => {

  const newOffer = JSON.parse(JSON.stringify(mockOffer));

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).put(`/offers/FTePrA`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offer is really changed`, () => request(app).get(`/offers/FTePrA`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

describe(`API refuses to change offer`, () => {

  const newOffer = JSON.parse(JSON.stringify(mockOffer));

  const app = createAPI();

  test(`When trying to change non-existent offer response code is 404`, () => {

    const validOffer = {...newOffer};

    return request(app).put(`/offers/NOEXIST`).send(validOffer)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`When trying to change an offer with invalid data response code is 400`, () => {

    const invalidOffer = {...newOffer};
    delete invalidOffer.sum;

    return request(app).put(`/offers/FTePrA`).send(invalidOffer)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API correctly deletes an offer`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/HcshRN`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`HcshRN`));

  test(`Offer count is 3 now`, () => request(app).get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

describe(`API refuses to delete non-existent offer`, () => {

  const app = createAPI();

  test(`When trying to delete non-existent offer response code is 404`, () => {

    return request(app).delete(`/offers/NOEXIST`)
    .expect(HttpCode.NOT_FOUND);
  });
});
