const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('User routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('Creates a new Book via POST', async() => {
    await User.insert({
      email: 'test@test.com',
      passwordHash: 'word',
      userImage: 'test.jpg',
      bio: 'Im a new user sup',
      userName: 'Test User',
      userLocation: 'Portland',
      books: {
        title: 'Test Title',
        author: 'Test Author'
      }
    }
    );
    return request(app)
      .post('/api/v1/books')
      .send({
        title: 'Harry Potter',
        author: 'evil woman',
        googleId: '1123123',
        ownerId: 1,
        image: 'harry.jpg',
        isTradeable: false,
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          title: 'Harry Potter',
          author: 'evil woman',
          googleId: '1123123',
          ownerId: '1',
          image: 'harry.jpg',
          isTradeable: false,
        });
      });
  });
});
