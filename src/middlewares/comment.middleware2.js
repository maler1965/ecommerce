const catchAsync = require('../utils/catchAsync');
const Comment2 = require('../models/comment.model2');
const AppError = require('../utils/appError');

exports.validComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment2 = await Comment2.findOne({
    where: {
      status: true,
      id,
    },
  });

  if (!comment2) {
    return next(new AppError('Comment not found', 404));
  }

  req.comment2 = comment2;
  next();
});
