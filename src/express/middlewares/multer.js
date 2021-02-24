'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const MAX_NAME_LENGTH = 10;

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, cb) => {
    const uniqueName = nanoid(MAX_NAME_LENGTH);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

module.exports.upload = multer({storage});
