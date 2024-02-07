const express = require('express');
const morgan = require('morgan');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const compression = require('compression');
const cors = require('cors');

const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
//const session = require('express-session');

const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoutes');
const recipeRouter = require('./routes/recipeRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

//require('dotenv').config();
dotenv.config({ path: './config.env' });

//////////////////////////////////
const app = express();

//////////////////////////////////
// 1) GLOBAL MIDDLEWARE

// Set security HTTP headers
//app.use(helmet());

// Implement CORS
app.use(cors());

// Access-Control-Allow-Origin header to everything
app.options('*', cors());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Parse data coming from a url encoded form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Parses the data from cookie
app.use(cookieParser());

// Date Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Dare Sanitization against XSS(cross-site scripting attacks)
app.use(xss());

// Almacenamiento de los datos de sesion en el servidor
/*
app.use(
  session({
    secret: process.env.SESSION_PASSWORD,
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: 'strict' },
  }),
);*/

// Serving Static Files public.
app.use(express.static('public'));

// compress all the text that is sent to client. not img
app.use(compression());

// Set Templating Engine ----
// Setting up: Pug in express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

//////////////////////////////////
// 2) ROUTES

app.use('/', viewRouter);
app.use('/users', userRouter);
app.use('/recipes', recipeRouter);

app.all('*', (req, res, next) => {
  const url = `URL: ${req.originalUrl}`;

  next(
    new AppError(`🙈 No podemos encontrar ( ${url} ) en este servidor`, 404),
  );
});

app.use(globalErrorHandler);

//////////////////////////////////
module.exports = app;
