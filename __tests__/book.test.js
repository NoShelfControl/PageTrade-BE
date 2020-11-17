const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Book = require('../lib/models/Book');
const { exec, execSync } = require('child_process');
const { response } = require('../lib/app');
const agent = request.agent(app);

beforeAll(async done => {

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

describe('User routes', () => {

  it('Creates a new Book via POST', async() => {
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
      .post('/api/v1/books')
      .send({
        title: 'Harry Potter',
        author: 'ronald',
        googleId: '1123123',
        ownerId: 1,
        image: 'harry.jpg',
        isTradeable: false,
        isWatched: false,
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          title: 'Harry Potter',
          author: 'ronald',
          googleId: '1123123',
          ownerId: '2',
          image: 'harry.jpg',
          isTradeable: false,
          isWatched: false,
        });
      });
  });
  it('finds all user books via GET', async() => {
    await User.insert({
      email: 'test@test.com',
      passwordHash: 'word',
      userImage: 'test.jpg',
      bio: 'Im a new user sup',
      userName: 'Test User',
      userLocation: 'Portland',
    });

    await Book.insert({
      title: 'Harry Potter',
      author: 'ronald',
      googleId: '1123123',
      ownerId: 1,
      image: 'harry.jpg',
      isTradeable: false,
      isWatched: false,
    });

    return agent
      .get('/api/v1/books')
      .then(res => {
        expect(res.body).toEqual([{
          id: expect.any(String),
          title: 'Harry Potter',
          author: 'ronald',
          googleId: '1123123',
          ownerId: '2',
          image: 'harry.jpg',
          isTradeable: false,
          isWatched: false,
        }]);
      });
  });
  it('deletes a book via DELETE', async () => {
    await User.insert({
      email: 'test@test.com',
      passwordHash: 'word',
      userImage: 'test.jpg',
      bio: 'Im a new user sup',
      userName: 'Test User',
      userLocation: 'Portland',
    });

    await Book.insert({
      title: 'Harry Potter',
      author: 'ronald',
      googleId: '1123123',
      ownerId: 1,
      image: 'harry.jpg',
      isTradeable: false,
      isWatched: false,
    });

    return agent
      .delete('/api/v1/books/1123123')
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          title: 'Harry Potter',
          author: 'ronald',
          googleId: '1123123',
          ownerId: '2',
          image: 'harry.jpg',
          isTradeable: false,
          isWatched: false,
        });
      });
  });

  it('updates a book by id via PUT', async() => {
    await User.insert({
      email: 'test@test.com',
      passwordHash: 'word',
      userImage: 'test.jpg',
      bio: 'Im a new user sup',
      userName: 'Test User',
      userLocation: 'Portland',
    });
    
    const book = await Book.insert({
      title: 'Harry Potter',
      author: 'ronald',
      googleId: '1123123',
      ownerId: '1',
      image: 'harry.jpg',
      isTradeable: false,
      isWatched: false,
    });

    return agent
      .put(`/api/v1/books/${book.id}`)
      .send({
        title: 'Harry Potter',
        author: 'ronald',
        googleId: '1123123',
        ownerId: '1',
        image: 'harry.jpg',
        isTradeable: false,
        isWatched: false,
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          title: 'Harry Potter',
          author: 'ronald',
          googleId: '1123123',
          ownerId: '1',
          image: 'harry.jpg',
          isTradeable: false,
          isWatched: false,
        });
      });
  });
});
