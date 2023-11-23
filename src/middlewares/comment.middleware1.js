const catchAsync = require('../utils/catchAsync');
const Comment1 = require('../models/comment.model1');
const AppError = require('../utils/appError');
const { updateComment1 } = require('../controllers/comment.controller1');

exports.validComment1 = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment1 = await updateComment1.findOne({
    where: {
      status: true,
      id,
    },
  });

  if (!comment1) {
    return next(new AppError('Comment1 not found', 404));
  }

  req.comment1 = comment1;
  next();
});
