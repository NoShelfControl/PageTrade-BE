const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Action = require('../models/Feed');

module.exports = Router()
    .post('/', ensureAuth, (req, res, next) => {
        Action.insert({ ...req.body, userId: req.user.id })
            .then(action => res.send(action))
            .catch(next);
    });
