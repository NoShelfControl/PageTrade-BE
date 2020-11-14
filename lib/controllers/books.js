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
  });
