const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const redisClient = require('redis').createClient();
const RedisStore = require('connect-redis')(session);

const auth = require('./auth/index');
const routes = require('./routes/api');

const app = express();
// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'this is secret!',
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      host: 'localhost',
      port: 6379,
      client: redisClient,
      ttl: 86400
    }),
    cookie: {
      secure: false,
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
auth.initialiseAuthentication(app);
app.use('/', routes);


// Server start
app.listen(
  process.env.PORT,
  console.log(`Server Started, listening ${process.env.PORT}`)
);
