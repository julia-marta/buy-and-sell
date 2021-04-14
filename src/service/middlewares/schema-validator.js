'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (schema, logger, service) => (

  async (req, res, next) => {
    const {body} = req;

    let validSchema;

    if (service) {
      try {
        const allCategories = await service.findAll();
        const allCategoriesIds = allCategories.reduce((acc, item) => ([
          item.id,
          ...acc
        ]), []);

        validSchema = schema(allCategoriesIds);
      } catch (err) {
        logger.error(`Can't get valid schema.`);
        res.status(HttpCode.BAD_REQUEST).json({errorMessages: [`Something wrong`]});

        return;
      }

    } else {
      validSchema = schema;
    }

    try {
      await validSchema.validateAsync(body, {abortEarly: false});
    } catch (err) {
      const {details} = err;
      logger.error(`Data is not valid.`);

      res.status(HttpCode.BAD_REQUEST)
        .json({errorMessages: details.map((errorDescription) => errorDescription.message)});

      return;
    }

    next();
  }
);
