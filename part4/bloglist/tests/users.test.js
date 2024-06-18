const bcrypt = require('bcrypt');
const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);

const User = require('../models/user');

describe('ensure invalid users or passwords are not allowed', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('whatever', 10);
    const user = new User({
      username: 'muestra',
      passwordHash,
      name: 'pablito'
    });

    await user.save();
  });

  test('add a proper user is valid', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'otracosa',
      password: 'yanosequeponer',
      name: 'otro yo'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(el => el.username);
    assert(usernames.includes(newUser.username));
  });

  test('invalid users trows error', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      password: 'heyitsmeagain',
      name: 'inventate uno'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);

    assert(result.body.error.includes('You should type a valid username'));
  });

  test("can't add an existing username", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'muestra',
      password: 'cualquira',
      name: 'pablito'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes('The user already exists'));
  });
});

after(async () => {
  await mongoose.connection.close();
});
