const passport = require('passport');
const { OAuth2Strategy } = require('passport-oauth');
const { signToken } = require('../utils');

const strategy = app => {
  const strategyOptions = {
    name: 'google',
    authorizationURL: process.env.AUTH_GOOGLE_AUTH_URL,
    tokenURL: process.env.AUTH_GOOGLE_TOKEN_URL,
    clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.AUTH_GOOGLE_CALLBACK
  };

  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  };
  passport.use('google', new OAuth2Strategy(strategyOptions, verifyCallback));

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      return res
        .status(200)
        .cookie('jwt', signToken(req.user), {
          httpOnly: true
        })
        .redirect('/');
    }
  );

  return app;
};

module.exports = strategy;
