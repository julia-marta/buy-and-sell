'use strict';

module.exports.mockCategories = [
  `Животные`,
  `Журналы`,
  `Цветы`,
  `Книги`,
  `Разное`,
  `Игры`,
  `Марки`
];

module.exports.mockOffers = [
  {
    type: `SALE`,
    title: `Продам советскую посуду. Почти не разбита.`,
    description: `Кажется, что это хрупкая вещь.`,
    sum: 82743,
    picture: `item12.jpg`,
    categories: [
      `Животные`,
      `Журналы`,
      `Цветы`,
      `Книги`,
      `Разное`,
      `Игры`
    ],
    userId: 1
  },
  {
    type: `OFFER`,
    title: `Продам новую приставку Sony Playstation 5.`,
    description: `Мой дед не мог её сломать. Если найдёте дешевле — сброшу цену. Таких предложений больше нет! Кому нужен этот новый телефон, если тут такое... Продаю с болью в сердце...`,
    sum: 94532,
    picture: `item05.jpg`,
    categories: [
      `Игры`,
      `Разное`,
      `Марки`
    ],
    userId: 2
  },
  {
    type: `SALE`,
    title: `Куплю антиквариат.`,
    description: `Две страницы заляпаны свежим кофе.`,
    sum: 39815,
    picture: `item05.jpg`,
    categories: [
      `Игры`,
      `Журналы`,
      `Животные`,
      `Разное`,
      `Цветы`
    ],
    userId: 1
  }
];

module.exports.mockUsers = [
  {
    firstname: `Иван`,
    lastname: `Иванов`,
    email: `ivan@ya.ru`,
    password: `0403942d9d1bd8c2f93ea2f08abd7ba7`,
    avatar: `avatar.jpg`
  },
  {
    firstname: `Петр`,
    lastname: `Петров`,
    email: `petr@ya.ru`,
    password: `0403942d9d1bd8c2f93ea2f08abd7ba7`,
    avatar: `avatar.jpg`
  },
];

module.exports.mockComments = [
  {
    text: `А где блок питания? Вы что?! В магазине дешевле.`,
    offerId: 1,
    userId: 2,
  },
  {
    text: `Совсем немного...`,
    offerId: 2,
    userId: 1,
  },
  {
    text: `Почему в таком ужасном состоянии? А где блок питания? Совсем немного...`,
    offerId: 3,
    userId: 1,
  },
  {
    text: `Вы что?! В магазине дешевле. Неплохо, но дорого. А где блок питания?`,
    offerId: 3,
    userId: 1,
  },
  {
    text: `А где блок питания?`,
    offerId: 3,
    userId: 2,
  },
  {
    text: `А сколько игр в комплекте? С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца.`,
    offerId: 3,
    userId: 2,
  }
];
