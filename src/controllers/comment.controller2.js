const catchAsync = require('../utils/catchAsync');
const Comment2 = require('../models/comment.model2');
const { Op } = require('sequelize');

exports.findAllComment2 = catchAsync(async (req, res, next) => {
  // const { initDate, endDate } = req.query;

  const comments2 = await Comment2.findAll({
    where: {
      status: true,
      // createdAt: {
      //   [Op.between]: [initDate, endDate],
      // },
    },
  });

  return res.status(200).json({
    status: 'success',
    results: comments2.length,
    comments2,
  });
});

exports.createComment2 = catchAsync(async (req, res, next) => {
  const { textId2 } = req.body;
  const { id: userId } = req.sessionUser;
  const { name: name } = req.sessionUser;
 // const { id: postId } = req.params;
 const { textId2: text } = textId2;
 const { postId: postId } = textId2;

  const comment2 = await Comment2.create({ text, postId, userId, name });

  return res.status(201).json({
    status: 'success',
    message: 'Comment created successfully',
    comment2,
  });
});

exports.findOneComment2 = catchAsync(async (req, res, next) => {
  const { comment2 } = req;

  return res.status(200).json({
    status: 'success',
    comment2,
  });
});

exports.updateComment2 = catchAsync(async (req, res, next) => {
  const { comment2 } = req;
  const { text } = req.body;

  await comment2.update({ text });

  return res.status(200).json({
    status: 'success',
    message: 'Comment2 updated successfully',
  });
});

exports.deleteComment2 = catchAsync(async (req, res, next) => {
  const { comment2 } = req;

  await comment2.update({ status: false });

  return res.status(200).json({
    status: 'success',
    message: 'Comment2 deleted successfully',
  });
});
