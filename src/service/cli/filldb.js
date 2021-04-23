'use strict';

const fs = require(`fs`).promises;
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);
const {ExitCode} = require(`../../const`);
const {getRandomInt, shuffleArray} = require(`../../utils`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_NAMES_PATH = `./data/names.txt`;
const FILE_SURNAMES_PATH = `./data/surnames.txt`;
const FILE_EMAILS_PATH = `./data/emails.txt`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const OfferRestrict = {
  MIN: 1,
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

const AvatarRestrict = {
  MIN: 1,
  MAX: 4,
};

const CommentsRestrict = {
  MIN: 1,
  MAX: 4,
};

const CommentLengthRestrict = {
  MIN: 1,
  MAX: 3,
};

const USERS_COUNT = 5;
const DEFAULT_PASSWORD = `85064efb60a9601805dcea56ec5402f7`;

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    logger.error(`Error when reading file: ${err.message}`);
    return [];
  }
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const getAvatarName = (number) => `avatar${number.toString().padStart(2, 0)}.jpg`;

const generateOfferComments = (count, comments, offer, usersCount) => (
  Array(count).fill({}).map(() => ({

    text: shuffleArray(comments)
      .slice(0, getRandomInt(CommentLengthRestrict.MIN, CommentLengthRestrict.MAX))
      .join(` `),
    offerId: offer,
    userId: getRandomInt(1, usersCount)
  }))
);

const generateUsers = (count, names, surnames, emails) => (
  Array(count).fill({}).map((_, index) => ({
    firstname: names[getRandomInt(0, names.length - 1)],
    lastname: surnames[getRandomInt(0, surnames.length - 1)],
    email: emails[index],
    password: DEFAULT_PASSWORD,
    avatar: getAvatarName(getRandomInt(AvatarRestrict.MIN, AvatarRestrict.MAX))
  }))
);

const generateOffers = (count, titles, categories, sentences, usersCount) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffleArray(sentences).slice(0, getRandomInt(DescriptionRestrict.MIN, DescriptionRestrict.MAX)).join(` `),
    type: Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    categories: shuffleArray(categories).slice(0, getRandomInt(1, categories.length - 1)),
    userId: getRandomInt(1, usersCount)
  }))
);

const generateComments = (comments, count, usersCount) => {

  return Array(count).fill().reduce((allComments, _, index) => {

    return allComments.concat(
        generateOfferComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments, index + 1, usersCount)
    );
  }, []);
};

module.exports = {
  name: `--filldb`,

  async run(args) {

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.error);
    }
    logger.info(`Connection to database established`);

    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentsSentences = await readContent(FILE_COMMENTS_PATH);
    const names = await readContent(FILE_NAMES_PATH);
    const surnames = await readContent(FILE_SURNAMES_PATH);
    const emails = await readContent(FILE_EMAILS_PATH);

    const [count] = args;
    const countNumber = Number.parseInt(count, 10) || OfferRestrict.MIN;

    if (countNumber > OfferRestrict.MAX) {
      logger.error(`Не больше 1000 объявлений`);
      process.exit(ExitCode.success);
    }

    const countOffer = countNumber > OfferRestrict.MIN ? countNumber : OfferRestrict.MIN;

    const users = generateUsers(USERS_COUNT, names, surnames, emails);
    const offers = generateOffers(countOffer, titles, categories, sentences, USERS_COUNT);
    const comments = generateComments(commentsSentences, countOffer, USERS_COUNT);

    return initDatabase(sequelize, {offers, categories, users, comments});
  }
};
