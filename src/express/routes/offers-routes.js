'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const privateRoute = require(`../middlewares/private-route`);
const {getRandomInt} = require(`../../utils`);
const {DEFAULT_IMAGE, CategoryImageName} = require(`../../const`);
const offersRouter = new Router();

const api = apiFactory.getAPI();

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, privateRoute, async (req, res, next) => {

  const {offer = null, errorMessages = null} = req.session;

  try {
    const categories = await api.getCategories();
    req.session.offer = null;
    req.session.errorMessages = null;
    res.render(`offers/new-ticket`, {categories, offer, errorMessages});
  } catch (err) {
    next(err);
  }
});

offersRouter.post(`/add`, [privateRoute, upload.single(`avatar`)], async (req, res) => {

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
    return res.redirect(`/my`);
  } catch (error) {
    req.session.offer = offerData;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/offers/add`);
  }
});

offersRouter.get(`/edit/:id`, privateRoute, async (req, res, next) => {
  const {id} = req.params;
  const {newData = null, errorMessages = null} = req.session;

  try {
    const categories = await api.getCategories();
    let offer;

    if (newData) {
      offer = {...newData, id};
    } else {
      offer = await api.getOffer(id);
      const offerCategories = offer.categories.reduce((acc, item) => ([
        item.id.toString(),
        ...acc
      ]), []);
      offer = {...offer, categories: offerCategories};
    }

    req.session.newData = null;
    req.session.errorMessages = null;
    res.render(`offers/ticket-edit`, {offer, categories, errorMessages});
  } catch (err) {
    next(err);
  }
});

offersRouter.post(`/edit/:id`, [privateRoute, upload.single(`avatar`)], async (req, res) => {
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
    return res.redirect(`/my`);
  } catch (error) {
    req.session.newData = newData;
    req.session.errorMessages = error.response.data.errorMessages;

    return res.redirect(`/offers/edit/${id}`);
  }
});

offersRouter.get(`/:id`, async (req, res, next) => {
  const {id} = req.params;
  const {errorMessages = null} = req.session;

  try {
    const offer = await api.getOffer(id, {comments: true});

    const images = Array(offer.categories.length).fill().map(() => (
      getRandomInt(CategoryImageName.MIN, CategoryImageName.MAX)
    ));

    req.session.errorMessages = null;
    res.render(`offers/ticket`, {offer, images, errorMessages});
  } catch (err) {
    next(err);
  }
});

offersRouter.post(`/:id`, [privateRoute, upload.single(`avatar`)], async (req, res) => {

  const {id} = req.params;
  const {body} = req;

  const commentData = {
    text: body.comment
  };

  try {
    await api.createComment(id, commentData);
    return res.redirect(`back`);
  } catch (error) {
    req.session.errorMessages = error.response.data.errorMessages;
    return res.redirect(`back`);
  }
});

module.exports = offersRouter;
