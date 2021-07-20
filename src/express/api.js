'use strict';

const axios = require(`axios`);
const {API_PREFIX} = require(`../const`);

const TIMEOUT = 1000;
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = `http://localhost`;

const port = process.env.API_PORT || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
const defaultURL = `${host}:${port}${API_PREFIX}/`;

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  getOffers() {
    return this._load(`/offers`);
  }

  getPopularOffers({limit} = {}) {
    return this._load(`/offers/popular`, {params: {limit}});
  }

  getLastOffers({limit} = {}) {
    return this._load(`/offers/last`, {params: {limit}});
  }

  getUserOffers({userId, comments} = {}) {
    return this._load(`/offers/user`, {params: {userId, comments}});
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

  createOffer(userId, data) {
    return this._load(`/offers`, {
      method: `POST`,
      params: {userId},
      data
    });
  }

  updateOffer(id, data) {
    return this._load(`/offers/${id}`, {
      method: `PUT`,
      data
    });
  }

  deleteOffer(offerId, userId) {
    return this._load(`/offers/${offerId}`, {
      method: `DELETE`,
      params: {userId},
    });
  }

  createComment(id, userId, data) {
    return this._load(`/offers/${id}/comments`, {
      method: `POST`,
      params: {userId},
      data
    });
  }

  deleteComment(id, offerId, userId) {
    return this._load(`/offers/${offerId}/comments/${id}`, {
      method: `DELETE`,
      params: {userId},
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

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
