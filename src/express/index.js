'use strict';

const express = require(`express`);
const path = require(`path`);

const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {HttpCode} = require(`../const`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const TEMPLATES_DIR = `templates`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);

app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((err, _req, res, _next) => {

  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(process.env.PORT || DEFAULT_PORT);
