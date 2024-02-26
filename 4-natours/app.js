const express = require('express');
const morgan = require('morgan');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const { findOneAndDelete } = require('./models/tourModel');

//* 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//* 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server`,
    404,
  );
  //? Another way
  // const error = new Error(`Can't find ${req.originalUrl} on this server`);
  // error.status = 'fail';
  // error.statusCode = 404;

  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
