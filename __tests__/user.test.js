const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('User routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('Creates a new User via POST', () => {
    return request(app)
      .post('/api/v1/signup')
      .send({
        email: 'test@test.com',
        password: 'word',
        userImage: 'test.jpg',
        bio: 'Im a new user sup',
        userName: 'Test User',
        userLocation: 'Portland'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com',
          userImage: 'test.jpg',
          bio: 'Im a new user sup',
          userName: 'Test User',
          userLocation: 'Portland'
        });
      });
  });
});
