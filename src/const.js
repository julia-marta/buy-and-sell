'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;

module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

module.exports.MIN_PRICE = 100;

module.exports.MIN_CATEGORIES_LENGTH = 1;

module.exports.Type = {
  OFFER: `OFFER`,
  SALE: `SALE`,
};

module.exports.Title = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 100,
};

module.exports.Text = {
  MIN_LENGTH: 50,
  MAX_LENGTH: 1000,
};

module.exports.Comment = {
  MIN_LENGTH: 20,
  MAX_LENGTH: 1000,
};

module.exports.OfferMessage = {

  REQUIRED: {
    TITLE: `Укажите название объявления`,
    TEXT: `Заполните описание объявления`,
    CATEGORIES: `Выберите хотя бы одну категорию`,
    PRICE: `Укажите цену`,
    TYPE: `Выберите тип объявления`
  },
  VALID: {
    TYPE: `Недопустимый тип объявления`,
    CATEGORIES: `Выбрана несуществующая категория`
  },
  MIN_PRICE: `Цена не может быть меньше 100 рублей`,
  MIN_TITLE_LENGTH: `Заголовок должен быть не меньше 10 символов`,
  MAX_TITLE_LENGTH: `Заголовок должен быть не больше 100 символов`,
  MIN_TEXT_LENGTH: `Текст объявления должен быть не меньше 50 символов`,
  MAX_TEXT_LENGTH: `Текст объявления должен быть не больше 1000 символов`,
};

module.exports.CommentMessage = {
  REQUIRED: `Напишите что-нибудь`,
  MIN_TEXT_LENGTH: `Текст комментария должен быть не меньше 20 символов`,
  MAX_TEXT_LENGTH: `Текст объявления должен быть не больше 1000 символов`,
};

module.exports.CategoryImageName = {
  MIN: 1,
  MAX: 6,
};

module.exports.API_PREFIX = `/api`;

module.exports.MAX_ID_LENGTH = 6;

module.exports.IMAGE_TYPES = [`image/jpg`, `image/jpeg`, `image/png`];

module.exports.DEFAULT_IMAGE = `blank.png`;
