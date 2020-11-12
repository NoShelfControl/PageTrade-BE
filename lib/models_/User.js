const pool = require('../utils/pool');

module.exports = class User {
    id;
    email;
    passwordHash;
    userImage;
    bio;
    userName;
    userLocation;
    books;

    constructor(row) {
      this.id = row.id;
      this.email = row.email;
      this.passwordHash = row.password_hash;
      this.userImage = row.user_image;
      this.bio = row.bio;
      this.userName = row.user_name;
      this.userLocation = row.user_location;
      this.books = row.books;
    }

    static async insert(user) {
      const { rows } = await pool.query(
        `INSERT into users (
                email, 
                password_hash,
                user_image,
                bio,
                user_name,
                user_location,
                books)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
        [user.email, user.passwordHash, user.userImage, user.bio, user.userName, user.userLocation, user.books]
      );

      return new User(rows[0]);
    }

    toJSON() {
      const obj = { ...this };
      delete obj.passwordHash;
        
      return obj;
    }

};