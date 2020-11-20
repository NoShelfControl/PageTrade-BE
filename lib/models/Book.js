const pool = require('../utils/pool');

module.exports = class Book {
  id;
  title;
  author;
  googleId;
  userId;
  image;
  isTradeable;
  isWatched;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.author = row.author;
    this.googleId = row.google_id;
    this.ownerId = row.owner_id;
    this.image = row.image;
    this.isTradeable = row.is_tradeable;
    this.isWatched = row.is_watched;
  }

  static async insert(book) {
    const { rows } = await pool.query(`
    INSERT INTO books (title,
              author,
              google_id,
              owner_id,
              image,
              is_tradeable,
              is_watched)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    [book.title, book.author, book.googleId, book.ownerId, book.image, book.isTradeable, book.isWatched]
    );

    return new Book(rows[0]);
  }

  static async getUserBooks(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM books WHERE owner_id=$1',
      [userId]
    );

    return rows.map(book => new Book(book));
  }

  static async getAllBooks() {
    const { rows } = await pool.query(
      'SELECT * FROM books',
    );

    return rows.map(book => new Book(book));
  }

  static async update(book, id) {
    const { rows } = await pool.query(
      `UPDATE books
         SET title=$1,
             author=$2,
             google_id=$3,
             owner_id=$4,
             image=$5,
             is_tradeable=$6,
             is_watched=$7
         WHERE id=$8 AND owner_id=$4
         RETURNING *
        `,
      [book.title, book.author, book.googleId, book.ownerId, book.image, book.isTradeable, book.isWatched, id]
    );

    return new Book(rows[0]);
  }

  static async deleteBook(bookId, ownerId) {
    const { rows } = await pool.query(
      'DELETE FROM books WHERE google_id=$1 AND owner_id=$2 RETURNING *',
      [bookId, ownerId]
    );

    if(!rows[0]) return null;
    else return new Book(rows[0]);
  }
};
