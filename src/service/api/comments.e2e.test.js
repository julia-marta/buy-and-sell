'use strict';

const express = require(`express`);
const request = require(`supertest`);

const comments = require(`./comments`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const serviceLocator = require(`../lib/service-locator`)();
const {getLogger} = require(`../lib/logger`);

const {mockData} = require(`./offers.test-data`);
const {HttpCode} = require(`../../const`);

const createAPI = () => {
  serviceLocator.clear();

  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  const logger = getLogger();
  app.use(express.json());

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`offerService`, new OfferService(cloneData));
  serviceLocator.register(`commentService`, new CommentService());

  serviceLocator.factory(`comments`, comments);
  serviceLocator.get(`comments`);

  return app;
};

describe(`API returns a list of comments to given offer`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/U9cyX7/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's id equals "Wc7py5"`, () => expect(response.body[0].id).toBe(`Wc7py5`));

});

describe(`API refuses to return list of comments to non-existent offer`, () => {

  const app = createAPI();

  test(`When trying to get comments to non-existent offer response code is 404`, () => {

    return request(app).get(`/offers/NOEXIST/comments/P5YcED`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Новый комментарий`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers/U9cyX7/comments`).send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app).get(`/offers/U9cyX7/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API refuses to create a comment`, () => {

  const newComment = {
    text: `Новый комментарий`
  };

  const app = createAPI();

  test(`When trying to create a comment to non-existent offer response code is 404`, () => {

    return request(app).post(`/offers/NOEXIST/comments`).send(newComment)
      .expect(HttpCode.NOT_FOUND);

  });

  test(`When trying to create a comment without required property response code is 400`, () => {

    return request(app).post(`/offers/U9cyX7/comments`).send({})
      .expect(HttpCode.BAD_REQUEST);

  });

  test(`When trying to create a comment with additional excess property response code is 400`, () => {

    const invalidComment = {...newComment};
    invalidComment.excess = `excess value`;

    return request(app).post(`/offers/U9cyX7/comments`).send(invalidComment)
      .expect(HttpCode.BAD_REQUEST);

  });
});

describe(`API correctly deletes a comment`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/U9cyX7/comments/P5YcED`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`P5YcED`));

  test(`Comments count is 2 now`, () => request(app).get(`/offers/U9cyX7/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

describe(`API refuses to delete a comment`, () => {

  const app = createAPI();

  test(`When trying to delete non-existent comment response code is 404`, () => {

    return request(app).delete(`/offers/U9cyX7/comments/NOEXIST`)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`When trying to delete a comment to non-existent offer response code is 404`, () => {

    return request(app).delete(`/offers/NOEXIST/comments/P5YcED`)
      .expect(HttpCode.NOT_FOUND);
  });
});
