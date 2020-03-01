const express = require('express');
const ensureLoggedIn = require('connect-ensure-login');

module.exports = (app, passport) => {
  const router = express.Router();
  // Router middleware

  router.use('/google', passport.authenticate('google'));

  // Home page route.
  router.get('/', (req, res) => {
    res.send('Wiki home page');
  });
  // Login page route.
  router.get('/login', (req, res) => {
    res.send('Wiki home page');
  });

  // About page route.
  router.get('/google', (req, res) => {
    res.send('About this wiki');
  });
};
