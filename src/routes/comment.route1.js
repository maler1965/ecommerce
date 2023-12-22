const express = require('express');

//controllers
const commentController = require('../controllers/comment.controller1');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const commentMiddleware = require('../middlewares/comment.middleware1');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/').get(commentController.findAllComment1);

router.post(
  '/:id',
  validationMiddleware.createCommentValidation1,
  commentController.createComment1
);

router
  .use('/:id', commentMiddleware.validComment1)
  .route('/:id')
  .get(commentController.findOneComment1)
  .patch(
    validationMiddleware.updateCommentValidation,
    commentController.updateComment1
  )
  .delete(commentController.deleteComment1);

module.exports = router;
