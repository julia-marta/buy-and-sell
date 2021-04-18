'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = `http://localhost`;

const port = process.env.API_PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
const defaultURL = `${host}:${port}/api/`;

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers({comments} = {}) {
    return this._load(`/offers`, {params: {comments}});
  }

  getOffersByCategory(id, {offset, limit} = {}) {
    return this._load(`/offers/category/${id}`, {params: {offset, limit}});
  }

  getOffer(id, {comments} = {}) {
    return this._load(`/offers/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories({count} = {}) {
    return this._load(`/categories`, {params: {count}});
  }

  getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }

  updateOffer(id, data) {
    return this._load(`/offers/${id}`, {
      method: `PUT`,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/offers/${id}/comments`, {
      method: `POST`,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: `POST`,
      data
    });
  }

  loginUser(data) {
    return this._load(`/user/login`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
