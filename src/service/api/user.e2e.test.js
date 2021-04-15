/* eslint-disable max-nested-callbacks */
'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);
const serviceLocatorFactory = require(`../lib/service-locator`);
const {getLogger} = require(`../lib/test-logger`);
const {HttpCode, UserMessage, LoginMessage} = require(`../../const`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: [], offers: []});
  const serviceLocator = serviceLocatorFactory();
  const app = express();
  const logger = getLogger();
  app.use(express.json());

  serviceLocator.register(`app`, app);
  serviceLocator.register(`logger`, logger);
  serviceLocator.register(`userService`, new DataService(mockDB));
  serviceLocator.factory(`user`, user);
  serviceLocator.get(`user`);

  return app;
};

const mockUser = {
  firstname: `Юзер`,
  lastname: `Тестовый`,
  email: `user@ya.ru`,
  password: `qwerty12345`,
  repeat: `qwerty12345`,
  avatar: `photo.png`
};

const mockLoginData = {
  email: `user@ya.ru`,
  password: `qwerty12345`,
};

describe(`API creates user if data is valid`, () => {

  const newUser = JSON.parse(JSON.stringify(mockUser));

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/user`).send(newUser);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns user with email user@ya.ru`, () => expect(response.body.email).toEqual(`user@ya.ru`));
});

describe(`API refuses to create user if email is already registered`, () => {

  const newUser = JSON.parse(JSON.stringify(mockUser));
  const sameNewUser = JSON.parse(JSON.stringify(mockUser));

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    await request(app).post(`/user`).send(newUser);
    response = await request(app).post(`/user`).send(sameNewUser);
  });


  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.EMAIL_ALREADY_REGISTERED));
});


describe(`API refuses to create user if data is invalid`, () => {

  const newUser = JSON.parse(JSON.stringify(mockUser));

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`With any additional excess property response code is 400`, async () => {

    const badUser = {...newUser};
    badUser.excess = `excess value`;

    await request(app).post(`/user`).send(badUser).expect(HttpCode.BAD_REQUEST);
  });

  describe(`Without required firstname property`, () => {
    const badUser = {...newUser};
    delete badUser.firstname;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.REQUIRED.FIRSTNAME));
  });

  describe(`Without required lastname property`, () => {
    const badUser = {...newUser};
    delete badUser.lastname;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.REQUIRED.LASTNAME));
  });

  describe(`Without required email property`, () => {
    const badUser = {...newUser};
    delete badUser.email;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.REQUIRED.EMAIL));
  });

  describe(`Without required password property`, () => {
    const badUser = {...newUser};
    delete badUser.password;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.REQUIRED.PASSWORD));
  });

  describe(`Without required repeat property`, () => {
    const badUser = {...newUser};
    delete badUser.repeat;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.REQUIRED.REPEAT));
  });

  describe(`Without required avatar property`, () => {
    const badUser = {...newUser};
    delete badUser.avatar;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.REQUIRED.AVATAR));
  });

  describe(`With invalid firstname including numbers`, () => {
    const badUser = {...newUser};
    badUser.firstname = `Юзер123`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.VALID.FIRSTNAME));
  });

  describe(`With invalid lastname including whitespaces`, () => {
    const badUser = {...newUser};
    badUser.lastname = ` Т е с т о в ы й `;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.VALID.LASTNAME));
  });

  describe(`With invalid email`, () => {
    const badUser = {...newUser};
    badUser.email = `test@mail`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.VALID.EMAIL));
  });

  describe(`With password length less than min value`, () => {
    const badUser = {...newUser};
    badUser.password = `qwert`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.MIN_PASSWORD_LENGTH));
  });

  describe(`With repeat not matching password`, () => {
    const badUser = {...newUser};
    badUser.repeat = `qwerty67890`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user`).send(badUser);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(UserMessage.VALID.REPEAT));
  });
});


describe(`API authentificate user if login data is valid`, () => {

  const registeredUser = JSON.parse(JSON.stringify(mockUser));
  const loginData = JSON.parse(JSON.stringify(mockLoginData));

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    await request(app).post(`/user`).send(registeredUser);
    response = await request(app).post(`/user/login`).send(loginData);
  });


  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns registered user with valid firstname`, () => expect(response.body.firstname).toEqual(registeredUser.firstname));
});

describe(`API refuses to authentificate user if`, () => {

  const registeredUser = JSON.parse(JSON.stringify(mockUser));
  const loginData = JSON.parse(JSON.stringify(mockLoginData));

  let app;
  beforeAll(async () => {
    app = await createAPI();
    await request(app).post(`/user`).send(registeredUser);
  });

  describe(`email is not registered`, () => {

    const badLoginData = {...loginData};
    badLoginData.email = `wronguser@ya.ru`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user/login`).send(badLoginData);
    });


    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(LoginMessage.EMAIL_NOT_REGISTERED));
  });

  describe(`password is not match to registered`, () => {

    const badLoginData = {...loginData};
    badLoginData.password = `wrongpassword`;
    let response;

    beforeAll(async () => {
      response = await request(app).post(`/user/login`).send(badLoginData);
    });

    test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
    test(`Returns valid error message`, () => expect(response.text).toMatch(LoginMessage.WRONG_PASSWORD));
  });

  describe(`login data is invalid`, () => {

    test(`With any additional excess property response code is 400`, async () => {

      const badLoginData = {...loginData};
      badLoginData.excess = `excess value`;

      await request(app).post(`/user/login`).send(badLoginData).expect(HttpCode.BAD_REQUEST);
    });

    describe(`Without required email property`, () => {
      const badLoginData = {...loginData};
      delete badLoginData.email;
      let response;

      beforeAll(async () => {
        response = await request(app).post(`/user/login`).send(badLoginData);
      });

      test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
      test(`Returns valid error message`, () => expect(response.text).toMatch(LoginMessage.REQUIRED.EMAIL));
    });

    describe(`Without required password property`, () => {
      const badLoginData = {...loginData};
      delete badLoginData.password;
      let response;

      beforeAll(async () => {
        response = await request(app).post(`/user/login`).send(badLoginData);
      });

      test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
      test(`Returns valid error message`, () => expect(response.text).toMatch(LoginMessage.REQUIRED.PASSWORD));
    });

    describe(`With invalid email`, () => {
      const badLoginData = {...loginData};
      badLoginData.email = `test@mail`;
      let response;

      beforeAll(async () => {
        response = await request(app).post(`/user/login`).send(badLoginData);
      });

      test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
      test(`Returns valid error message`, () => expect(response.text).toMatch(LoginMessage.EMAIL_NOT_VALID));
    });
  });
});
