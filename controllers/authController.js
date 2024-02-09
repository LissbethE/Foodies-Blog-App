const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

///////////////////////////////////
const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = function (user, statusCode, res, req) {
  // If everything ok, Send TOKEN to client
  const token = signToken(user._id);

  // sending JWT via cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true,
  };

  // secure: req.secure || req.headers['x-forwarded-proto'] === 'https' || true,

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  // Send responde to client
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

///////////////////////////////////
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // Send Response 🛩️
  createSendToken(newUser, 201, res, req);
});

// LOGGING IN USERS
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password)
    return next(
      new AppError(
        `💥 Por favor proporcione correo electrónico y contraseña'`,
        400,
      ),
    );

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('💥 Correo o contraseña incorrectos'), 401);

  // 3) If everything ok, Send TOKEN to client
  // Send Response 🛩️
  createSendToken(user, 200, res, req);
});

// Logging out users
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

///////////////////////////////////

// Proteguiendo algunas rutas, permitiendo acceso solo los usuarios regitrados
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    // 401 -> Unauthorized
    return next(
      new AppError(
        '¡No has iniciado sesión! Por favor inicie sesión para obtener acceso.',
        401,
      ),
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('El usuario que pertenece a este TOKEN ya no existe.', 401),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changesdPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        '👤¡El usuario cambió recientemente su contraseña! 🔄 Inicie sesión nuevamente',
        401,
      ),
    );
  }

  // Grant Access To Protected Route
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 2) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changesdPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user.
      res.locals.user = currentUser;

      next();
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};
