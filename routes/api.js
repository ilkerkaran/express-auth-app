const { ensureLoggedIn } = require('connect-ensure-login');
const express = require('express');
const passport = require('passport');

const currentAuthType = process.env.AUTH_TYPE;
const router = express.Router();

router.get('/login', (req, res) => res.redirect(`${currentAuthType}/login`));

router.get('/loggedin', passport.authenticate(currentAuthType), (req, res) => {
  res.redirect('/');
});

router.get('/', ensureLoggedIn(), (req, res) => res.send({ message: 'You are loggedin!' }));

router.use('/hello', (req, res) => {
  res.send({ data: 'Hello World!' });
});
router.use('', (req, res) => {
  res.status(404).send('Sorry, cant find that');
});

module.exports = router;
