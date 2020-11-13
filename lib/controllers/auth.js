const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const UserService = require('../services/user-service');

const setSessionCookie = (res, user) => {
  const token = UserService.authToken(user);
  res.cookie('session/wristband', token, {
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  });
};

module.exports = Router()
  .post('/signup', (req, res, next) => {
    UserService
      .signup(req.body)
      .then(user => {
        setSessionCookie(res, user);
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    UserService
      .authorize(req.body)
      .then(user => {
        setSessionCookie(res, user);
        res.send(user);
      })
      .catch(next);
  })

  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  });
