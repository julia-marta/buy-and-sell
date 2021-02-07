'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  ExitCode
} = require(`../../const`);

const {
  getRandomInt,
  shuffleArray,
} = require(`../../utils`);

const FILE_NAME = `mocks.json`;
const MAX_DESCRIPTION_LENGTH = 5;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

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

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getPictureFileName = (number) => number > 10 ? `item${number}.jpg` : `item0${number}.jpg`;

const generateOffers = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    type: Object.keys(OfferType)[getRandomInt(0, Object.keys(OfferType).length - 1)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffleArray(sentences).slice(0, getRandomInt(1, MAX_DESCRIPTION_LENGTH)).join(` `),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    category: shuffleArray(categories).slice(0, getRandomInt(1, categories.length - 1)),
  }))
);

module.exports = {
  name: `--generate`,

  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countNumber = Number.parseInt(count, 10) || OfferRestrict.MIN;

    if (countNumber > OfferRestrict.MAX) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.success);
    }

    const countOffer = countNumber > OfferRestrict.MIN ? countNumber : OfferRestrict.MIN;
    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

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
