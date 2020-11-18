const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Actions = require('../lib/models/Feed');
const { response } = require('express');
const agent = request.agent(app);

describe('Feed routes', () => {
    beforeEach(() => {
        return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));  
    })

    beforeEach(async done => {
        agent
          .post('/api/v1/signup')
          .send({
              email: 'ryan@diff.com',
              password: '1234'
          })
          .end((err, response) => {
              token = response.body.token;
              done()
          });
    });
    it('Creates a new Action via POST', async () => {
        await User.insert({
          email: 'test@test.com',
          passwordHash: 'word',
          userImage: 'test.jpg',
          bio: 'Im a new user sup',
          userName: 'Test User',
          userLocation: 'Portland',
        }
        );
        return agent
          .post('/api/v1/feed')
          .send({
            actionType: 'Trade request',
            book: 'Hp',
          })
          .then(res => {
            expect(res.body).toEqual({
              id: expect.any(String),
              actionType: 'Trade request',
              book: 'Hp',
              userId: expect.any(String),
            });
          });
      });
})

