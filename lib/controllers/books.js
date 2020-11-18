const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Book = require('../models/Book');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Book.insert({ ...req.body, ownerId: req.user.id })
      .then(book => res.send(book))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Book.getUserBooks(req.params.id)
      .then(books => res.send(books))
      .catch(next);
  })
  .get('/', ensureAuth, (req, res, next) => {
    Book.getUserBooks(req.user.id)
      .then(books => res.send(books))
      .catch(next);
  })
  .put('/:id', ensureAuth, (req, res, next) => {
    Book.update({ ...req.body }, req.params.id)
      .then(book => res.send(book))
      .catch(next);
  })
  .delete('/:id', ensureAuth, async (req, res, next) => {
    Book.deleteBook(req.params.id, req.user.id)
      .then(book => res.send(book))
      .catch(next);
  });
