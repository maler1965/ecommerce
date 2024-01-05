const catchAsync = require('../utils/catchAsync');
const Comment1 = require('../models/comment.model1');
const { Op } = require('sequelize');

exports.findAllComment1 = catchAsync(async (req, res, next) => {
  // const { initDate, endDate } = req.query;

  const comments1 = await Comment1.findAll({
    where: {
      status: true,
      // createdAt: {
      //   [Op.between]: [initDate, endDate],
      // },
    },
  });

  return res.status(200).json({
    status: 'success',
    results: comments1.length,
    comments1,
  });
});


exports.createComment1 = catchAsync(async (req, res, next) => {
  const { textId1 } = req.body;
  const { id: userId } = req.sessionUser;
  const { name: name } = req.sessionUser;
 //const { id: postId } = req.params;
 const { textId1: text } = textId1;
 const { postId: postId } = textId1;

  const comment1 = await Comment1.create({ text, postId, userId, name });


  // Recuperar todos los comentarios del usuario
  const userComments1 = await Comment1.findAll({
    where: { 
      postId,
      status: true,
     },

    // Puedes agregar otras opciones de consulta según tus necesidades
  });


  return res.status(201).json({
    status: 'success',
    message: 'Comment1 created successfully',
    comment1,
    userComments1,
  });
});




exports.findOneComment1 = catchAsync(async (req, res, next) => {
  const { comment1 } = req;

  return res.status(200).json({
    status: 'success',
    comment1,
  });
});

exports.updateComment1 = catchAsync(async (req, res, next) => {
  const { comment1 } = req;
  const { text } = req.body;

  await comment1.update({ text });

  return res.status(200).json({
    status: 'success',
    message: 'Comment1 updated successfully',
  });
});

exports.deleteComment1 = catchAsync(async (req, res, next) => {
  const { comment1 } = req;

  await comment1.update({ status: false });

  return res.status(200).json({
    status: 'success',
    message: 'Comment1 deleted successfully',
  });
});
