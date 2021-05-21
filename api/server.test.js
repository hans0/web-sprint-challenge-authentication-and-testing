const request = require('supertest');

const Users = require('./users/users-model');
const db = require('../data/dbConfig');
const server = require('./server');
// const { request } = require('./server');

// Write your tests here
beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('users').truncate();
});
afterAll(async () => {
  await db.destroy();
});


describe('User', () => {

  describe('sanity', () => {
    test('User is defined', () => {
      expect(Users).toBeDefined()
    });
    test('Environment is correct', () => {
      expect(process.env.NODE_ENV).toBe('testing')
    });
  });

  // describe('user registration', async () => {
  //   it('resolves to a list of users', async () => {
  //     let users = await Users.getAll()
  //     expect(users).toHaveLength(0)
  //   });
  // });

  describe('[POST] /api/auth', () => {
    it('can register user', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'foobie', password: 'bar' })
      expect(res.status).toBe(201)
    })
    it('can login as user', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'foobie', password: 'bar' })
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'foobie', password: 'bar' })
      expect(res.status).toBe(200)
    })
  });

  describe('[GET] /api/jokes', () => {
    it('cannot get jokes w/o login', async () => {
      const res = await request(server)
        .get('/api/jokes')
      expect(res.status).toBe(401)
    });
    it('can get jokes after login', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'foobie', password: 'bar' })
      const loginRes = await request(server)
        .post('/api/auth/login')
        .send({ username: 'foobie', password: 'bar' })
      // console.log(loginRes.body.token)
      const res = await request(server)
        .get('/api/jokes')
        .set({'Authorization': loginRes.body.token})
      expect(res.status).toBe(200)
    })
  })



})


