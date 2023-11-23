const express = require('express');

//controllers
const commentController = require('../controllers/comment.controller2');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const commentMiddleware = require('../middlewares/comment.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/').get(commentController.findAllComment2);

router.post(
  '/:id',
  validationMiddleware.createCommentValidation,
  commentController.createComment2
);

router
  .use('/:id', commentMiddleware.validComment)
  .route('/:id')
  .get(commentController.findOneComment2)
  .patch(
    validationMiddleware.updateCommentValidation,
    commentController.updateComment2
  )
  .delete(commentController.deleteComment2);

module.exports = router;
