'use strict';

module.exports.mockCategories = [
  `Журналы`,
  `Игры`,
  `Разное`,
  `Посуда`,
  `Цветы`,
  `Животные`,
  `Марки`,
  `Книги`
];

module.exports.mockOffers = [
  {
    type: `SALE`,
    title: `Куплю породистого кота.`,
    description: `Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Кажется, что это хрупкая вещь. Мой дед не мог её сломать.`,
    sum: 83497,
    picture: `item13.jpg`,
    categories: [
      `Журналы`
    ],
    userId: 2,
  },
  {
    type: `OFFER`,
    title: `Куплю детские санки.`,
    description: `Таких предложений больше нет! При покупке с меня бесплатная доставка в черте города. Бонусом отдам все аксессуары. Не пытайтесь торговаться. Цену вещам я знаю.`,
    sum: 9108,
    picture: `item13.jpg`,
    categories: [
      `Игры`,
      `Разное`
    ],
    userId: 1,
  },
  {
    type: `SALE`,
    title: `Куплю породистого кота.`,
    description: `Мой дед не мог её сломать. Если найдёте дешевле — сброшу цену.`,
    sum: 6659,
    picture: `item12.jpg`,
    categories: [
      `Посуда`,
      `Цветы`,
      `Животные`,
      `Марки`,
      `Книги`
    ],
    userId: 2,
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
    text: `Неплохо, но дорого. Оплата наличными или перевод на карту? А сколько игр в комплекте?`,
    offerId: 1,
    userId: 2,
  },
  {
    text: `А где блок питания? Совсем немного...`,
    offerId: 2,
    userId: 1,
  },
  {
    text: `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. А сколько игр в комплекте?`,
    offerId: 2,
    userId: 2,
  },
  {
    text: `А сколько игр в комплекте? Почему в таком ужасном состоянии?`,
    offerId: 2,
    userId: 1,
  },
  {
    text: `С чем связана продажа? Почему так дешёво?`,
    offerId: 3,
    userId: 1,
  },
  {
    text: `Совсем немного... Неплохо, но дорого. А где блок питания?`,
    offerId: 3,
    userId: 2,
  }
];
