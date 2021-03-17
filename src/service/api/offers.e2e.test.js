'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const offers = require(`./offers`);
const DataService = require(`../data-service/offer`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const {getLogger} = require(`../lib/test-logger`);
const {mockOffers, mockCategories, mockOffer} = require(`./offers.test-data`);
const {HttpCode} = require(`../../const`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  const serviceLocator = serviceLocatorFactory();
  const app = express();
  const logger = getLogger();
  app.use(express.json());

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`offerService`, new DataService(mockDB));
  serviceLocator.factory(`offers`, offers);
  serviceLocator.get(`offers`);

  return app;
};

describe(`API returns a list of all offers`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 offers`, () => expect(response.body.length).toBe(4));
  test(`First offer's sum equals 4667`, () => expect(response.body[0].sum).toBe(4667));
});

describe(`API returns an offer with given id`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Продам отличную подборку фильмов на VHS."`, () => expect(response.body.title).toBe(`Продам отличную подборку фильмов на VHS.`));
});

describe(`API refuses to return non-existent offer`, () => {

  test(`When trying to get non-existent offer response code is 404`, async () => {

    const app = await createAPI();

    return request(app).get(`/offers/NOEXIST`)
    .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API creates an offer if data is valid`, () => {

  const newOffer = JSON.parse(JSON.stringify(mockOffer));

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/offers`).send(newOffer);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer with id equals 5`, () => expect(response.body.id).toEqual(5));

  test(`Offers count is changed`, () => request(app).get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(5))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {

  const newOffer = JSON.parse(JSON.stringify(mockOffer));

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

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

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/offers/4`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns message of success updating`, () => expect(response.text).toBe(`Offer was updated`));
  test(`Offer is really changed`, () => request(app).get(`/offers/4`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );
});

describe(`API refuses to change offer`, () => {

  const newOffer = JSON.parse(JSON.stringify(mockOffer));

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When trying to change non-existent offer response code is 404`, () => {

    const validOffer = {...newOffer};

    return request(app).put(`/offers/NOEXIST`).send(validOffer)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`When trying to change an offer with invalid data response code is 400`, () => {

    const invalidOffer = {...newOffer};
    delete invalidOffer.sum;

    return request(app).put(`/offers/4`).send(invalidOffer)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API correctly deletes an offer`, () => {

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/offers/3`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns message of success deleting`, () => expect(response.text).toBe(`Offer was deleted`));
  test(`Offer count is 3 now`, () => request(app).get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

describe(`API refuses to delete non-existent offer`, () => {

  test(`When trying to delete non-existent offer response code is 404`, async () => {
    const app = await createAPI();

    return request(app).delete(`/offers/NOEXIST`)
    .expect(HttpCode.NOT_FOUND);
  });
});
