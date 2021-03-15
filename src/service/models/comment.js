"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Comment extends Model {}

const defineComment = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

const defineCommentRelations = (Offer) => {

  Comment.belongsTo(Offer, {foreignKey: `offerId`});
};

module.exports = {defineComment, defineCommentRelations};
