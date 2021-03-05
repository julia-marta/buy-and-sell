'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../const`);
const {getRandomInt, shuffleArray} = require(`../../utils`);

const FILE_NAME = `fill-db.sql`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const OfferRestrict = {
  MIN: 5,
  MAX: 1000,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const DescriptionRestrict = {
  MIN: 1,
  MAX: 5,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const CommentsRestrict = {
  MIN: 2,
  MAX: 4,
};

const CommentLengthRestrict = {
  MIN: 1,
  MAX: 3,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, offerId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    offerId,
    text: shuffleArray(comments)
      .slice(0, getRandomInt(CommentLengthRestrict.MIN, CommentLengthRestrict.MAX))
      .join(` `),
  }))
);

const generateCategories = (count, categoryCount) => {

  const categories = new Set(Array(count).fill().map(() => {
    return getRandomInt(1, categoryCount);
  }));

  return [...categories];
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateOffers = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffleArray(sentences).slice(0, getRandomInt(DescriptionRestrict.MIN, DescriptionRestrict.MAX)).join(` `),
    type: Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    category: generateCategories(getRandomInt(1, categoryCount), categoryCount),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), index + 1, userCount, comments),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,

  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

    const [count] = args;
    const countNumber = Number.parseInt(count, 10) || OfferRestrict.MIN;

    if (countNumber > OfferRestrict.MAX) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.success);
    }

    const countOffer = countNumber > OfferRestrict.MIN ? countNumber : OfferRestrict.MIN;

    const offers = generateOffers(countOffer, titles, categories.length, users.length, sentences, commentSentences);
    const comments = offers.flatMap((offer) => offer.comments);

    const offerCategories = offers.flatMap((offer, index) => {
      return offer.category.map((category) => ({offerId: index + 1, categoryId: category}));
    });

    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}) =>
      `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const offerValues = offers.map(({title, description, type, sum, picture, userId}) =>
      `('${title}', '${description}', '${type}', ${sum}, '${picture}', ${userId})`
    ).join(`,\n`);

    const offerCategoryValues = offerCategories.map(({offerId, categoryId}) =>
      `(${offerId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(({text, userId, offerId}) =>
      `('${text}', ${userId}, ${offerId})`
    ).join(`,\n`);

    const content = `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE offers DISABLE TRIGGER ALL;
INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
${offerValues};
ALTER TABLE offers ENABLE TRIGGER ALL;
ALTER TABLE offer_categories DISABLE TRIGGER ALL;
INSERT INTO offer_categories(offer_id, category_id) VALUES
${offerCategoryValues};
ALTER TABLE offer_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
