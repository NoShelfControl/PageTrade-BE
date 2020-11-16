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
  .delete('/:id', async(req, res, next) => {
    try {
      const response = await Book.deleteBook(req.params.id);
      res.send(response);
    } catch(error) {
      next(error);
    }
  });
