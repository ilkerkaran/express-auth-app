const ensureLoggedIn = require('connect-ensure-login');
const express = require('express');

const router = express.Router();

// Home page route.
router.get('/', (req, res) => {
  res.send('Welcome to API');
});

// About page route.
router.get('/profile', ensureLoggedIn('/auth/login'), (req, res) => {
  res.send('About this wiki');
});

module.exports = router;
