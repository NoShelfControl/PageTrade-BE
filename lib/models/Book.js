const pool = require('../utils/pool');

module.exports = class Book {
  id;
  title;
  author;
  googleId;
  userId;
  image;
  isTradeable

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.author = row.author;
    this.googleId = row.google_id;
    this.ownerId = row.owner_id;
    this.image = row.image;
    this.isTradeable = row.is_tradeable;
  }

  static async insert(book) {
    const { rows } = await pool.query(`
    INSERT INTO books (title,
              author,
              google_id,
              owner_id,
              image,
              is_tradeable)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [book.title, book.author, book.googleId, book.ownerId, book.image, book.isTradeable]
    );

    return new Book(rows[0]);
  }
};