const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Book = require('../models/Book');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Book.insert({ ...req.body, ownerId: req.user.id })
      .then(book => res.send(book))
      .catch(next);
  })
  .get('/', ensureAuth, (req, res, next) => {
    Book.getUserBooks(req.user.id)
      .then(books => res.send(books))
      .catch(next);
  })
  .put('/', ensureAuth, (req, res, next) => {
    Book.update({ ...req.body })
      .then(book => res.send(book))
      .catch(next);
  })
  .delete('/:id', ensureAuth, async(req, res, next) => {
    try {
      Book.deleteBook(req.params.id)
        .then(book => res.send(book));
    } catch(error) {
      next(error);
    }
  });
