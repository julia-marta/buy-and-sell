'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const OFFERS_PER_PAGE = 8;
const PAGER_WIDTH = 2;
const MAX_ID_LENGTH = 6;
const API_PREFIX = `/api`;
const DEFAULT_IMAGE = `blank.png`;

const IMAGE_TYPES = [`image/jpg`, `image/jpeg`, `image/png`];

const ExitCode = {
  error: 1,
  success: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const Offer = {
  TYPE: {
    OFFER: `OFFER`,
    SALE: `SALE`,
  },
  MIN_TEXT_LENGTH: 50,
  MAX_TEXT_LENGTH: 1000,
  MIN_TITLE_LENGTH: 10,
  MAX_TITLE_LENGTH: 100,
  MIN_PRICE: 100,
  MIN_CATEGORIES_LENGTH: 1
};

const Comment = {
  MIN_LENGTH: 20,
  MAX_LENGTH: 1000,
};

const User = {
  MIN_PASSWORD_LENGTH: 6,
};

const OfferMessage = {

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

const CommentMessage = {
  REQUIRED: `Напишите что-нибудь`,
  MIN_TEXT_LENGTH: `Текст комментария должен быть не меньше 20 символов`,
  MAX_TEXT_LENGTH: `Текст объявления должен быть не больше 1000 символов`,
};

const UserMessage = {

  REQUIRED: {
    FIRSTNAME: `Укажите ваше имя`,
    LASTNAME: `Укажите вашу фамилию`,
    EMAIL: `Укажите ваш e-mail`,
    PASSWORD: `Введите пароль`,
    REPEAT: `Введите пароль ещё раз`,
    AVATAR: `Загрузите аватар`
  },
  VALID: {
    FIRSTNAME: `Имя может содержать только буквы и не должно включать пробелы`,
    LASTNAME: `Фамилия может содержать только буквы и не должно включать пробелы`,
    EMAIL: `E-mail не валиден. Введите валидный адре электронной почты`,
    REPEAT: `Пароли не совпадают. Проверьте введённые данные`
  },
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
  EMAIL_ALREADY_REGISTERED: `Пользователь с таким электронным адресом уже зарегистрирован`
};

const LoginMessage = {

  REQUIRED: {
    EMAIL: `Укажите ваш e-mail`,
    PASSWORD: `Введите пароль`,
  },
  EMAIL_NOT_VALID: `E-mail не валиден. Введите валидный адре электронной почты`,
  EMAIL_NOT_REGISTERED: `Пользователь с таким электронным адресом не зарегистрирован`,
  WRONG_PASSWORD: `Неверный пароль`
};

const CategoryImageName = {
  MIN: 1,
  MAX: 6,
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  OFFERS_PER_PAGE,
  PAGER_WIDTH,
  MAX_ID_LENGTH,
  API_PREFIX,
  DEFAULT_IMAGE,
  IMAGE_TYPES,
  ExitCode,
  HttpCode,
  Offer,
  Comment,
  User,
  OfferMessage,
  CommentMessage,
  UserMessage,
  LoginMessage,
  CategoryImageName
};
