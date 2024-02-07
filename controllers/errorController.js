const AppError = require('../utils/AppError');

// ---- ERORES DB ----
const handleCastErrorDB = function ({ path, value }) {
  const message = `🙅 Inválido ${path}: ${value} 👎`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  const message = `🙅 Valor de campo duplicado: "${err.keyValue.name}", utilice otro valor.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `🙅 Datos de entrada no válidos. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

// ---- JWT ----
const handleJWTError = function () {
  return new AppError(
    '💥 Inválido Token. 🔄 Por favor inicie sesión nuevamente',
    401,
  );
};

const handleJWTExpiredError = function () {
  return new AppError(
    '💥 ¡Su token ha caducado! 🔄 Por favor inicie sesión nuevamente',
    401,
  );
};

//////////////////////////////////
const sendErrorDev = function (err, req, res) {
  //  RENDERED WEBSITE
  console.error('💥 ERROR 💥', err);

  return res.status(err.statusCode).render('errorPage', {
    title: '💥¡Algo salió muy mal!',
    msg: err.message,
  });
};

const sendErrorProd = function (err, req, res) {
  //  Rendered Website
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).render('errorPage', {
      title: '💥¡Algo salió muy mal!',
      msg: err.message,
    });
  } else {
    //  B) Programming or other unknown error: don't leak error details
    // 1) Log Error
    console.error('💥 ERROR 💥', err);

    // 2) Send generic message
    return res.status(err.statusCode).render('errorPage', {
      title: '💥¡Algo salió muy mal!',
      msg: 'Por favor, inténtelo de nuevo más tarde.',
    });
  }
};

//////////////////////////////////
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //////////////////////////////////
  // Error de desarrollo
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);

  //////////////////////////////////
  // Error de producción: send message to client
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    const { name, code } = err;

    if (name === 'CastError') error = handleCastErrorDB(err);
    if (code === 11000) error = handleDuplicateFieldsDB(err);
    if (name === 'ValidationError') error = handleValidationErrorDB(err);
    if (name === 'JsonWebTokenError') error = handleJWTError();
    if (name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }

  next();
};
