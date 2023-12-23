const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet'); //protege los datos que vienen en el header de la solicitud
const hpp = require('hpp'); //para que no se envie en la solicitud palabras repetidas
const sanitizater = require('perfect-express-sanitizer');

const AppError = require('./utils/appError');
const globalErrorHander = require('./controllers/error.controller');

//routes
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const postRoutes = require('./routes/post.route');
const commentRoutes = require('./routes/comment.route');
const commentRoutes2 = require('./routes/comment.route2');
const commentRoutes1 = require('./routes/comment.route1');

const app = express();
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(
  sanitizater.clean({
    xss: true,
    noSql: true,
    sql: false, //obligatoriamente debe ir en false
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



app.use('/api/v1', limiter);

//routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/comments2', commentRoutes2);
app.use('/api/v1/comments1', commentRoutes1);
app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHander);

module.exports = app;
