'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const comments = require(`./comments`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const {getLogger} = require(`../lib/test-logger`);
const {mockOffers, mockCategories} = require(`./offers.test-data`);
const {HttpCode, CommentMessage} = require(`../../const`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers});
  const serviceLocator = serviceLocatorFactory();
  const app = express();
  const logger = getLogger();
  app.use(express.json());

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`offerService`, new OfferService(mockDB));
  serviceLocator.register(`commentService`, new CommentService(mockDB));

  serviceLocator.factory(`comments`, comments);
  serviceLocator.get(`comments`);

  return app;
};

describe(`API returns a list of comments to given offer`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`Third comment's text is "Оплата наличными или перевод на карту?"`, () => expect(response.body[2].text).toBe(`Оплата наличными или перевод на карту?`));

});

describe(`API refuses to return list of comments to non-existent offer`, () => {

  test(`When trying to get comments to non-existent offer response code is 404`, async () => {
    const app = await createAPI();

    return request(app).get(`/offers/NOEXIST/comments/1`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Новый валидный комментарий`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/offers/1/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment with valid text`, () => expect(response.body.text).toBe(`Новый валидный комментарий`));
  test(`Comments count is changed`, () => request(app).get(`/offers/1/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API refuses to create a comment`, () => {

  const newComment = {
    text: `Новый валидный комментарий`
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When trying to create a comment to non-existent offer response code is 404`, () => {

    return request(app).post(`/offers/NOEXIST/comments`).send(newComment)
      .expect(HttpCode.NOT_FOUND);

  });

  test(`When trying to create a comment with additional excess property response code is 400`, () => {

    const invalidComment = {...newComment};
    invalidComment.excess = `excess value`;

    return request(app).post(`/offers/1/comments`).send(invalidComment)
      .expect(HttpCode.BAD_REQUEST);

  });

  describe(`When trying to create a comment without required property`, () => {
    const badComment = {};
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers/1/comments`).send(badComment);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(CommentMessage.REQUIRED));
  });

  describe(`When trying to create a comment with length less than min value`, () => {
    const badComment = {
      text: `Короткий коммент`
    };
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/offers/1/comments`).send(badComment);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(CommentMessage.MIN_TEXT_LENGTH));
  });
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/offers/1/comments/3`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns message of success deleting`, () => expect(response.text).toBe(`Comment was deleted`));

  test(`Comments count is 2 now`, () => request(app).get(`/offers/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

describe(`API refuses to delete a comment`, () => {

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`When trying to delete non-existent comment response code is 404`, () => {

    return request(app).delete(`/offers/1/comments/50`)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`When trying to delete a comment to non-existent offer response code is 404`, () => {

    return request(app).delete(`/offers/NOEXIST/comments/1`)
      .expect(HttpCode.NOT_FOUND);
  });
});
