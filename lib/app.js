const express = require('express');
const app = express();

app.use(require('cookie-parser')());
app.use(express.json());

app.use(require('cors')({
  origin: true,
  credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/', require('./controllers/auth'));
app.use('/api/v1/books', require('./controllers/books'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
