const { OAuth2Strategy } = require('passport-oauth');
const LocalStrategy = require('passport-local').Strategy;
const userService = require('../userService');

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
const googleOAuthStrategy = () => new OAuth2Strategy(
  {
    authorizationURL: process.env.AUTH_GOOGLE_AUTH_URL,
    tokenURL: process.env.AUTH_GOOGLE_TOKEN_URL,
    clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.AUTH_GOOGLE_CALLBACK
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
);

const amazonCognitoOAuthStrategy = new OAuth2Strategy(
  {
    authorizationURL: process.env.AUTH_GOOGLE_AUTH_URL,
    tokenURL: process.env.AUTH_GOOGLE_TOKEN_URL,
    clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.AUTH_GOOGLE_CALLBACK
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
);

module.exports.localStrategy = localStrategy;
module.exports.useGoogleOAuthStrategy = googleOAuthStrategy;
module.exports.amazonCognitoOAuthStrategy = amazonCognitoOAuthStrategy;
