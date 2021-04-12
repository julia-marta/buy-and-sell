'use strict';

const {HttpCode, UserMessage} = require(`../../const`);

module.exports = (service, logger) => async (req, res, next) => {
  const {email} = req.body;

  const userAlreadyExists = await service.findByEmail(email);

  if (userAlreadyExists) {
    logger.error(`User with this email already registered.`);

    res.status(HttpCode.BAD_REQUEST)
      .json({errorMessages: [UserMessage.EMAIL_ALREADY_REGISTERED]});

    return;
  }

  next();
};
