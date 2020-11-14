const { Router } = require('express');
const Book = require('../models/Book');

module.exports = Router()
  .post('/', (req, res, next) => {
    Book.insert(req.body)
      .then(book => res.send(book))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Book.getUserBooks(req.params.id)
      .then(books => res.send(books))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Book
      .update(req.params.id, req.body)
      .then(book => res.send(book))
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
