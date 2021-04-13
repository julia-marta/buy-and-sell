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

  getOffers({offset, limit, comments} = {}) {
    return this._load(`/offers`, {params: {offset, limit, comments}});
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
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
