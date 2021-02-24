'use strict';

const {Router} = require(`express`);
const apiFactory = require(`../api`);
const {upload} = require(`../middlewares/multer`);
const offersRouter = new Router();

const api = apiFactory.getAPI();

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories});
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {

  const {body, file} = req;
  const offerData = {
    picture: file.filename,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    category: typeof body.category === `string` ? [body.category] : body.category
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

offersRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;

  try {
    const [offer, categories] = await Promise.all([
      api.getOffer(id),
      api.getCategories()
    ]).catch((error) => {
      throw error;
    });

    res.render(`offers/ticket-edit`, {offer, categories});
  } catch (err) {
    next(err);
  }
});

offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

module.exports = offersRouter;
