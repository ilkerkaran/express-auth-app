const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const redisClient = require('redis').createClient();
const RedisStore = require('connect-redis')(session);
const { ensureLoggedIn } = require('connect-ensure-login');
const strategy = require('./auth/strategy');
const auth = require('./auth/index');
const { signToken } = require('./auth/utils');
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
auth.initialiseAuthentication(app);

// Routes
console.log('base', process.env.BASE_URL);

app.get(
  '/login',
  passport.authenticate('google', {
    successRedirect: '/loggedin',
    failureRedirect: '/login',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
);

app.get('/loggedin', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

app.get('/', ensureLoggedIn(), (req, res) =>
  res.send({ message: 'You are loggedin!' })
);

app.post(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(req.user.profile);
  }
);

app.use('/hello', (req, res) => {
  res.send({ data: 'Hello World!' });
});
app.use('', (req, res) => {
  res.status(404).send('Sorry, cant find that');
});
// Server start
app.listen(
  process.env.PORT,
  console.log(`Server Started, listening ${process.env.PORT}`)
);
