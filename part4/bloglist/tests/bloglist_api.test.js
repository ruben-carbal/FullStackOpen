const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const app = require('../app');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'How to make api tests',
    author: 'Pedro Sanchez',
    url: 'http://www.apitests.com',
    likes: 12
  },
  {
    title: 'The best proramming blog',
    author: 'Arturo Sanchez',
    url: 'http://www.thebestprogrammingblog.com',
    likes: 2
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }

  const user = new User({
    username: 'loquesemeocurra',
    password: 'elpasswordmasseguro'
  });
  await user.save();

  const userForToken = {
    username: user.username,
    id: user._id
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  global.testToken = token;
});

test('A call to /api/blogs should return the blogs in JSON format', async () => {
  api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('The blog list return the correct amount of blogs posts', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test('The unique identifier property is named id', async () => {
  const response = await Blog.find({});
  const transformed = response.map(el => el.toJSON());
  const keys = transformed.map(el => Object.keys(el));

  assert(!keys[0].includes('_id'));
  assert(keys[0].includes('id'));
});

test('An HTTP POST succesfully creates a new blog post', async () => {
  const newBlog = {
    title: 'A new blog',
    author: 'Miguel Hernandez',
    url: 'http://www.newblog.com',
    likes: 5
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${global.testToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await api.get('/api/blogs');

  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length + 1);
});

test.only('If the like property is missing it will be 0 by default', async () => {
  const newBlog = {
    title: 'A new blog',
    author: 'Miguel Hernandez',
    url: 'http://www.newblog.com'
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${global.testToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogLikes = await api.get('/api/blogs');
  const theNewBlog = blogLikes.body[blogLikes.body.length - 1];

  assert.strictEqual(theNewBlog.likes, 0);
  assert.strictEqual(blogLikes.body.length, initialBlogs.length + 1);
});

test('If the author or url is missing respond satus 400', async () => {
  const newBlog = {
    author: 'Rafa Marquez'
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${global.testToken}`)
    .send(newBlog)
    .expect(400);

  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test('A blog can be deleted', async () => {
  const blogsAtStart = await Blog.find({});
  const blogs = blogsAtStart.map(el => el.toJSON());
  const blogToDelete = blogs[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204);

  const response = await Blog.find({});
  assert.strictEqual(response.length, initialBlogs.length - 1);
});

test('Updating a note', async () => {
  const newBlog = {
    title: 'How to make api tests',
    author: 'Pedro Sanchez',
    url: 'http://www.apitests.com',
    likes: 16
  };

  const blogsAtStart = await Blog.find({});
  const listOfBlogs = blogsAtStart.map(el => el.toJSON());
  const blogToUpdate = listOfBlogs[0];

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await Blog.find({});
  assert.strictEqual(response.length, initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
