const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/Models/User');

describe('User routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'))
  });

  it('Creates a new User via POST', () => {
    return request(app)
      .post('/api/v1/signup')
      .send({
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
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com',
          passwordHash: expect.any(String),
          userImage: 'test.jpg',
          bio: 'Im a new user sup',
          userName: 'Test User',
          userLocation: 'Portland',
          books: {
            title: 'Test Title',
            author: 'Test Author'
          }
        });
      });
  });
});
