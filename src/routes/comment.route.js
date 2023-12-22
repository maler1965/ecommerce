const express = require('express');

//controllers
const commentController = require('../controllers/comment.controller');

//middlewares
const authMiddleware = require('./../middlewares/auth.middleware');
const commentMiddleware = require('./../middlewares/comment.middleware');
const validationMiddleware = require('./../middlewares/validations.middleware');



const router = express.Router();

router.use(authMiddleware.protect);

router.route('/').get(commentController.findAllComment);

router.post(
  '/:id',
  validationMiddleware.createCommentValidation,
  commentController.createComment
);

router //no se esta usando esto
  .post('/one/:id',
   validationMiddleware.createCommentValidation,
  commentController.createComment )
  .delete('/all/:id',
  commentMiddleware.validCommentTotal,
  commentController.deleteCommentTotal  );

router
  .use('/:id', commentMiddleware.validComment)
  .route('/:id')
  .get(commentController.findOneComment)
  .patch(
    validationMiddleware.updateCommentValidation,
    commentController.updateComment
  )
  .delete(commentController.deleteComment); //deleteCommentTotal

module.exports = router;
