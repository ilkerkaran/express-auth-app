const passport = require('passport');
const { OAuth2Strategy } = require('passport-oauth');
const { signToken } = require('../utils');

const strategy = app => {
  const strategyOptions = {
    name: 'aws',
    authorizationURL: process.env.AUTH_AWS_AUTH_URL,
    tokenURL: process.env.AUTH_AWS_TOKEN_URL,
    clientID: process.env.AUTH_AWS_CLIENT_ID,
    clientSecret: process.env.AUTH_AWS_CLIENT_SECRET,
    callbackURL: process.env.AUTH_AWS_CALLBACK,
    region: process.env.AUTH_AWS_REGION
  };

  const verifyCallback = async (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  };
  passport.use('aws', new OAuth2Strategy(strategyOptions, verifyCallback));

  app.get(
    '/aws/login',
    passport.authenticate('aws', {
      successRedirect: '/loggedin',
      failureRedirect: '/login'
    })
  );

  app.get(
    '/auth/aws',
    passport.authenticate('aws')
  );

  app.get(
    '/auth/aws/callback',
    passport.authenticate('aws', { failureRedirect: '/login' }),
    (req, res) => res
      .status(200)
      .cookie('jwt', signToken(req.user), {
        httpOnly: true
      })
      .redirect('/')
  );

  return app;
};

module.exports = strategy;
