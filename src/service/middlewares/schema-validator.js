'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (schema, logger, service) => (

  async (req, res, next) => {
    const {body} = req;

    let validSchema;
    let allCategoriesIds;

    if (service) {
      try {
        const allCategories = await service.findAll();
        allCategoriesIds = allCategories.reduce((acc, item) => ([
          item.id,
          ...acc
        ]), []);
      } catch (err) {
        logger.error(`Can't get valid schema.`);
        res.status(HttpCode.BAD_REQUEST).json({errorMessages: [`Something wrong`]});

        return;
      }

    }

    validSchema = service ? schema(allCategoriesIds) : schema;

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
