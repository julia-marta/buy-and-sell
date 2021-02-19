'use strict';

const express = require(`express`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const {HttpCode, ExitCode, API_PREFIX} = require(`../../const`);

const DEFAULT_PORT = 3000;

const PortRestrict = {
  MIN: 0,
  MAX: 65536,
};

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  async run(args) {

    const [customPort] = args;

    const portNumber = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    const port = portNumber >= PortRestrict.MIN && portNumber < PortRestrict.MAX ? portNumber : DEFAULT_PORT;

    try {

      const router = await routes(logger);
      app.use(API_PREFIX, router);

      app.use((req, res) => {
        res.status(HttpCode.NOT_FOUND).send(`Not found`);
        logger.error(`Route not found: ${req.url}`);
      });

      app.use((err, _req, _res, _next) => {
        logger.error(`An error occured on processing request: ${err.message}`);
      });

      app.listen(port, (err) => {
        if (err) {
          logger.error(`An error occured on server creation: ${err.message}`);
          process.exit(ExitCode.error);
        }
        return logger.info(`Listening to connections on ${port}`);
      });

    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.error);
    }
  }
};
