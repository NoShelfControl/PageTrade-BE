const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Action = require('../lib/models/Feed');
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

    it('Gets all Actions via GET', async () => {
        const actions = await Promise.all([
            {
                userId: '1',
                actionType: 'Trade Request',
                book: 'HP'
            }
        ].map(action => Action.insert(action)));

        return request(app)
          .get('/api/v1/feed')
          .then(res => {
              actions.forEach(action => {
                  expect(res.body).toContainEqual(action);
              });
          });
    });
    it('finds all user Actions via GET', async () => {
        await User.insert({
          email: 'test@test.com',
          passwordHash: 'word',
          userImage: 'test.jpg',
          bio: 'Im a new user sup',
          userName: 'Test User',
          userLocation: 'Portland',
        });
    
        await Action.insert({
            userId: '1',
            actionType: 'Trade Request',
            book: 'HP'
        });
    
        return agent
          .get('/api/v1/feed')
          .then(res => {
            expect(res.body).toEqual([{
              id: expect.any(String),
              userId: '1',
              actionType: 'Trade Request',
              book: 'HP'
            }]);
          });
      });
})

