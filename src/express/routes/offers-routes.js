'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const {getRandomInt} = require(`../../utils`);
const {DEFAULT_IMAGE, CategoryImageName} = require(`../../const`);
const offersRouter = new Router();

const api = apiFactory.getAPI();

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, async (req, res, next) => {

  try {
    const categories = await api.getCategories();
    res.render(`offers/new-ticket`, {categories});
  } catch (err) {
    next(err);
  }
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {

  const {body, file} = req;

  const offerData = {
    picture: file ? file.filename : DEFAULT_IMAGE,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: typeof body.category === `string` ? [body.category] : body.category
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();
    const errorMessages = error.response.data.errorMessages;

    res.render(`offers/new-ticket`, {offer: offerData, categories, errorMessages});
  }
});

offersRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const [offer, categories] = await Promise.all([
      api.getOffer(id),
      api.getCategories()
    ]);

    const offerCategories = offer.categories.reduce((acc, item) => ([
      item.id.toString(),
      ...acc
    ]), []);

    res.render(`offers/ticket-edit`, {offer: {...offer, categories: offerCategories}, categories});
  } catch (err) {
    next(err);
  }
});

offersRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {id} = req.params;
  const {body, file} = req;

  const oldData = await api.getOffer(id);

  const newData = {
    picture: file ? file.filename : oldData.picture,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: typeof body.category === `string` ? [body.category] : body.category
  };

  try {
    await api.updateOffer(id, newData);
    res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();
    const errorMessages = error.response.data.errorMessages;

    res.render(`offers/ticket-edit`, {offer: {...newData, id}, categories, errorMessages});
  }
});

offersRouter.get(`/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const offer = await api.getOffer(id, {comments: true});

    const images = Array(offer.categories.length).fill().map(() => (
      getRandomInt(CategoryImageName.MIN, CategoryImageName.MAX)
    ));

    res.render(`offers/ticket`, {offer, images});
  } catch (err) {
    next(err);
  }
});

offersRouter.post(`/:id`, upload.single(`avatar`), async (req, res) => {

  const {id} = req.params;
  const {body} = req;

  const commentData = {
    text: body.comment
  };

  try {
    await api.createComment(id, commentData);
    res.redirect(`back`);
  } catch (error) {
    const offer = await api.getOffer(id, {comments: true});
    const errorMessages = error.response.data.errorMessages;
    const images = Array(offer.categories.length).fill().map(() => (
      getRandomInt(CategoryImageName.MIN, CategoryImageName.MAX)
    ));

    res.render(`offers/ticket`, {offer, images, errorMessages});
  }
});

module.exports = offersRouter;
