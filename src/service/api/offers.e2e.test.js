'use strict';

const express = require(`express`);
const http = require(`http`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const offers = require(`./offers`);
const OfferService = require(`../data-service/offer`);
const CategoryService = require(`../data-service/category`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const SocketService = require(`../lib/socket-service`);
const {getLogger} = require(`../lib/test-logger`);
const {mockOffers, mockCategories, mockUsers, mockComments, mockOffer} = require(`./offers.test-data`);
const {HttpCode, OfferMessage} = require(`../../const`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers, comments: mockComments});
  const serviceLocator = serviceLocatorFactory();
  const app = express();
  const server = http.createServer(app);
  const logger = getLogger();
  app.use(express.json());

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`socketService`, new SocketService(server));
  serviceLocator.register(`offerService`, new OfferService(mockDB));
  serviceLocator.register(`categoryService`, new CategoryService(mockDB));
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

  test(`With any additional excess property response code is 400`, async () => {

    const badOffer = {...newOffer};
    badOffer.excess = `excess value`;

    await request(app).post(`/offers`).send(badOffer).expect(HttpCode.BAD_REQUEST);
  });

  describe(`Without required title property`, () => {
    const badOffer = {...newOffer};
    delete badOffer.title;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.REQUIRED.TITLE));
  });

  describe(`Without required description property`, () => {
    const badOffer = {...newOffer};
    delete badOffer.description;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.REQUIRED.TEXT));
  });

  describe(`Without required type property`, () => {
    const badOffer = {...newOffer};
    delete badOffer.type;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.REQUIRED.TYPE));
  });

  describe(`Without required sum property`, () => {
    const badOffer = {...newOffer};
    delete badOffer.sum;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.REQUIRED.PRICE));
  });

  describe(`Without required categories property`, () => {
    const badOffer = {...newOffer};
    delete badOffer.categories;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.REQUIRED.CATEGORIES));
  });

  describe(`With invalid type`, () => {
    const badOffer = {...newOffer};
    badOffer.type = `RENT`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.VALID.TYPE));
  });

  describe(`With invalid category id`, () => {
    const badOffer = {...newOffer};
    badOffer.categories = [1, 2, 123];
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.VALID.CATEGORIES));
  });

  describe(`With categories not in array`, () => {
    const badOffer = {...newOffer};
    badOffer.categories = `123`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.VALID.CATEGORIES));
  });

  describe(`With sum less than min value`, () => {
    const badOffer = {...newOffer};
    badOffer.sum = 10;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.MIN_PRICE));
  });

  describe(`With title length less than min value`, () => {
    const badOffer = {...newOffer};
    badOffer.title = `Тест`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.MIN_TITLE_LENGTH));
  });

  describe(`With description length less than min value`, () => {
    const badOffer = {...newOffer};
    badOffer.description = `Короткое описание`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers`).send(badOffer);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(OfferMessage.MIN_TEXT_LENGTH));
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
    response = await request(app).delete(`/offers/3`).query({userId: 1});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns message of success deleting`, () => expect(response.text).toBe(`Offer was deleted`));
  test(`Offer count is 3 now`, () => request(app).get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

describe(`API refuses to delete offer`, () => {

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When trying to delete non-existent offer response code is 404`, async () => {

    return request(app).delete(`/offers/NOEXIST`)
    .expect(HttpCode.NOT_FOUND);
  });

  test(`When trying to delete offer not owned by user response code is 403`, async () => {

    return request(app).delete(`/offers/3`).query({userId: 2})
    .expect(HttpCode.FORBIDDEN);
  });
});
