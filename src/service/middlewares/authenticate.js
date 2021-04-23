'use strict';

const {HttpCode, LoginMessage} = require(`../../const`);

module.exports = (service, logger) => async (req, res, next) => {
  const {email, password} = req.body;

  try {
    const registeredUser = await service.findByEmail(email);

    if (!registeredUser) {
      logger.error(`User with this email not registered.`);

      res.status(HttpCode.BAD_REQUEST)
        .json({errorMessages: [LoginMessage.EMAIL_NOT_REGISTERED]});

      return;
    }

    const userPasswordIsValid = await service.checkUser(registeredUser, password);

    if (!userPasswordIsValid) {
      logger.error(`Wrong password.`);

      res.status(HttpCode.BAD_REQUEST)
        .json({errorMessages: [LoginMessage.WRONG_PASSWORD]});

      return;
    }

    res.locals.user = registeredUser;

  } catch (err) {
    logger.error(`Can't get user service.`);
    res.status(HttpCode.BAD_REQUEST).json({errorMessages: [`Something wrong`]});

    return;
  }

  next();
};
