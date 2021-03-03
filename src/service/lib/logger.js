"use strict";

const pino = require(`pino`);
const LOG_FILE = `./logs/api.log`;
const isDevMode = process.env.IS_DEV_MODE === `true`;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode
}, isDevMode ? process.stdout : pino.destination(LOG_FILE));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
