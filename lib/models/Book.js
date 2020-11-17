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

  static async getUserBooks(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM books WHERE owner_id=$1',
      [userId]
    );

    return rows.map(book => new Book(book));
  }

  static async update(book) {
    const { rows } = await pool.query(
      `UPDATE books
         SET title=$1,
             author=$2,
             google_id=$3,
             owner_id=$4,
             image=$5,
             is_tradeable=$6
         WHERE id=$7
         RETURNING *
        `,
      [book.title, book.author, book.googleId, book.ownerId, book.image, book.isTradeable, book.id]
    );
  
    return new Book(rows[0]);
  }

  static async deleteBook(bookId) {
    const { rows } = await pool.query(
      'DELETE FROM books WHERE google_id=$1 RETURNING *',
      [bookId]
    );

    if(!rows[0]) return null;
    else return new Book(rows[0]);
  }
};
