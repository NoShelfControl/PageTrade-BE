const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async ({
  email,
  password,
  userImage,
  userName,
  bio,
  userLocation,
  books
}) => {
  const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  return User.insert({
    email,
    passwordHash,
    userImage,
    userName,
    bio,
    userLocation,
    books
  });
};

const authToken = user => {
  const token = jwt.sign({
    payload: user.toJSON()
  }, process.env.APP_SECRET, {
    expiresIn: '24h'
  });

  return token;
};

module.exports = {
  signup,
  authToken
};
