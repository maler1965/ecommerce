const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment.model');
const { Op } = require('sequelize');

exports.findAllComment = catchAsync(async (req, res, next) => {
  // const { initDate, endDate } = req.query;

  const comments = await Comment.findAll({
    where: {
      status: true,
      // createdAt: {
      //   [Op.between]: [initDate, endDate],
      // },
    },
  });

  return res.status(200).json({
    status: 'success',
    results: comments.length,
    comments,
  });
});


exports.createComment = catchAsync(async (req, res, next) => {
  const { textId } = req.body;
  const { id: userId } = req.sessionUser;
  //const { id: postId } = req.params;
  const { name: name } = req.sessionUser;
  const { textId: text } = textId;
  const { postId: postId } = textId;

  const comment = await Comment.create({ text, postId, userId, name });

  // Recuperar todos los comentarios del usuario
  const userComments = await Comment.findAll({
    where: { 
      userId,
      status: true,
     },

    // Puedes agregar otras opciones de consulta según tus necesidades
  });

  return res.status(201).json({
    status: 'success',
    message: 'Comment created successfully',
    comment,
    userComments,
  });
});

exports.findOneComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  return res.status(200).json({
    status: 'success',
    comment,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req;
  const { text } = req.body;

  await comment.update({ text });

  return res.status(200).json({
    status: 'success',
    message: 'Comment updated successfully',
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;
  const { id: userId } = req.sessionUser;

 console.log({userId })
 console.log({ comment })

  await comment.update({ status: false });

   // Itera sobre cada comentario y actualiza el estado a false
/*
 await Promise.all(comment.map(async (oneComment) => {
  await oneComment.update({ status: false });
}));
*/

    // Recuperar todos los comentarios del usuario
  const nouComments = await Comment.findAll({
      where: { 
        userId,
        status: true,
       },
  
      // Puedes agregar otras opciones de consulta según tus necesidades
    });
  
    console.log({ nouComments })

  return res.status(200).json({
    status: 'success',
    message: 'Comment deleted successfully pedro',
    nouComments,
  });
});


/*
Si comment es un array con 30 elementos y deseas realizar la actualización en todos ellos, debes iterar sobre cada elemento del array y aplicar la actualización en cada uno. Puedes hacer esto utilizando un bucle for o métodos de array como forEach. Aquí hay un ejemplo utilizando forEach:
*/

exports.deleteCommentTotal = catchAsync(async (req, res, next) => {
  const { comment } = req;
  const { id: userId } = req.sessionUser;
 console.log({comment })

 // Itera sobre cada comentario y actualiza el estado a false
 await Promise.all(comment.map(async (singleComment) => {
  await singleComment.update({ status: false });
}));



 // await comment.update({ status: false });

  // Recuperar todos los comentarios del usuario
  const nouCommentsAll = await Comment.findAll({
    where: { 
      userId,
      status: true,
     },

    // Puedes agregar otras opciones de consulta según tus necesidades
  });

  console.log({ nouCommentsAll })

  return res.status(200).json({
    status: 'success',
    message: 'Comment deleted successfully  ',
    nouCommentsAll,
  });
});

