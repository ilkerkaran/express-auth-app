const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
// const jwtStrategy = require('passport-jwt').Strategy;
// const extractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const config = require('./config');
const userService = require('./userService');

const app = express();
// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

const localStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    try {
      console.log('userService');
      const user = userService.findUser(username, password);
      if (!user) return done(null, false, { message: 'Error!' });
      delete user.password;
      console.log('user', user);
      return done(null, user, { message: 'Success!' });
    } catch (err) {
      return done(err);
    }
  }
);
passport.use('login', localStrategy); // Authenticate

// Routes
app.post('/login', (req, res, next) => {
  console.log('login hit');
  passport.authenticate('login', async (err, user, message) => {
    try {
      console.log(message);
      console.log('user', user);
      if (err) next(err);
      const body = { _id: user.id, username: user.username };
      console.log('body', body);
      const token = jwt.sign(
        { user: body, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
        'very_secret_key'
      );
      return res.json({ token });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

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
  config.PORT,
  console.log(`Server Started, listening ${config.PORT}`)
);
