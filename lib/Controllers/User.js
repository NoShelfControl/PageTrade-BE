const { Router } = require('express');
const User = require('../Models/User');

module.exports = new Router()
.post('/', (req, res, next) => {
    User
      .insert(req.body)
      .then(user => res.send(user))
      .catch(next);
});