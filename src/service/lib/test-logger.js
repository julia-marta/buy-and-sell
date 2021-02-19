"use strict";

const pino = require(`pino`);
const LOG_FILE = `./logs/test.log`;

const logger = pino({
  name: `test-logger`,
  level: `debug`,
}, pino.destination(LOG_FILE));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
