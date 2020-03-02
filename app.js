const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const redisClient = require('redis').createClient();
const RedisStore = require('connect-redis')(session);
const { ensureLoggedIn } = require('connect-ensure-login');
const auth = require('./auth/index');
// const jwtStrategy = require('passport-jwt').Strategy;
// const extractJwt = require('passport-jwt').ExtractJwt;

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
console.log('auth', auth);


// Routes
console.log('base', process.env.BASE_URL);

const currentAuthType = process.env.AUTH_TYPE;

app.get('/login', (req, res) => res.redirect(`${currentAuthType}/login`));

app.get('/loggedin', passport.authenticate(currentAuthType), (req, res) => {
  res.redirect('/');
});

app.get('/', ensureLoggedIn(), (req, res) => res.send({ message: 'You are loggedin!' }));

app.use('/hello', (req, res) => {
  res.send({ data: 'Hello World!' });
});
auth.initialiseAuthentication(app);
app.use('', (req, res) => {
  res.status(404).send('Sorry, cant find that');
});

// List of all Routes
let route; const
  routes = [];

// eslint-disable-next-line no-underscore-dangle
app._router.stack.forEach((middleware) => {
  if (middleware.route) { // routes registered directly on the app
    routes.push(middleware.route);
  } else if (middleware.name === 'router') { // router middleware
    middleware.handle.stack.forEach((handler) => {
      route = handler.route;
      route && routes.push(route);
    });
  }
});
console.log('routes: ', routes);


// Server start
app.listen(
  process.env.PORT,
  console.log(`Server Started, listening ${process.env.PORT}`)
);
