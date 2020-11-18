const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

const agent = request.agent(app);

describe('User routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  beforeEach(async done => {
    agent
      .post('/api/v1/signup')
      .send({
        email: 'ryan@diff.com',
        password: '4321'
      })
      .end((err, response) => {
        token = response.body.token;
        done()
      });
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

  it('Updates a user via PUT', async () => {
    const user = await User.insert({
      email: 'test@test.com',
      passwordHash: 'word',
      userImage: 'test.jpg',
      bio: 'Im a new user sup',
      userName: 'Test User',
      userLocation: 'Portland'
    });

    return agent
      .put(`/api/v1/users/${user.id}`)
      .send({
        email: 'test@test1.com',
        userImage: 'test.jpg',
        bio: 'Im a new user sup',
        userName: 'Test User',
        userLocation: 'Portland'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test1.com',
          userImage: 'test.jpg',
          bio: 'Im a new user sup',
          userName: 'Test User',
          userLocation: 'Portland'
        });
      });
  });
});
