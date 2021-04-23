'use strict';

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(offerId, userId, comment) {
    const newComment = await this._Comment.create({
      offerId,
      userId,
      ...comment
    });
    return newComment.get();
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(offerId) {
    return this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }
}

module.exports = CommentService;
