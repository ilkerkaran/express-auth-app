const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const setup = () => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
};

const signToken = user => jwt.sign({ data: user }, process.env.JWT_SECRET, { expiresIn: 604800 });

const hashPassword = async password => {
  if (!password) {
    throw new Error('Password was not provided');
  }

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (candidate, actual) => bcrypt.compare(candidate, actual);

module.exports = {
  setup, signToken, hashPassword, verifyPassword
};
