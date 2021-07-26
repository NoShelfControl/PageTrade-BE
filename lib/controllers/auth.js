const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');
const UserService = require('../services/user-service');

const setSessionCookie = (res, user) => {
  const token = UserService.authToken(user);
  console.log(process.env.NODE_ENV);
  res.cookie('session', token, {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
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

  .post('/signin', (req, res, next) => {
    UserService
      .authorize(req.body)
      .then(user => {
        setSessionCookie(res, user);
        res.send(user);
      })
      .catch(next);
  })

  //make a findById function so that users can update their email
  .get('/verify', ensureAuth, (req, res) => {
    console.log('USERRRRRR1', req.user);
    User.findByEmail(req.user.email)
      .then(user => {
        console.log('USER2', req.user);
        req.user = user;
        return res.send(user);
      });
  })

  .put('/users', ensureAuth, (req, res, next) => {
    User.updateUser({ ...req.body }, req.user.id)
      .then(user => {
        req.user = user;
        return res.send(user);
      })
      .catch(next);
  });

