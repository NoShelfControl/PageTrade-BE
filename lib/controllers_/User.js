const { Router } = require('express');
const UserService = require('../services/user-service');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    UserService
      .signup(req.body)
      .then(user => {
        const token = UserService.authToken(user);
        res.cookie('session/wristband', [token, {
          maxAge: 1000 * 60 * 60 * 24,
          secure: true,
          httpOnly: true,
          sameSite: 'none'
        }]);
        res.send(user);
      })
      .catch(next);
  });
