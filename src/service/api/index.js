'use strict';

const categoriesRoute = require(`./categories`);
const offersRoute = require(`./offers`);
const commentsRoute = require(`./comments`);
const searchRoute = require(`./search`);
const userRoute = require(`./user`);

module.exports = {
  categoriesRoute,
  offersRoute,
  commentsRoute,
  searchRoute,
  userRoute
};
