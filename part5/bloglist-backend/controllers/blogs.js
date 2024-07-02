const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const user = request.user;

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    user,
    url: request.body.url,
    likes: request.body.likes || 0
  });

  if (!blog.title || !blog.url) {
    return response.status(400).end();
  }

  const result = await blog.save();
  user.blogs = user.blogs.concat(result);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  response.status(201).json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  const blogId = request.params.id;

  const user = request.user;
  console.log('user: ', user.toJSON());

  const blog = await Blog.findById(blogId);

  if (decodedToken.id === blog.user.toString()) {
    await Blog.findByIdAndDelete(blogId);
    return response.status(204).end();
  }
});

module.exports = blogsRouter;
