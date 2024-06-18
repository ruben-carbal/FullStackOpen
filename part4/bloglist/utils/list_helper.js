const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likes = blogs.map(el => el.likes);
  const sum = likes.reduce((acc, el) => {
    return acc + el;
  }, 0);

  return blogs.length === 0
    ? 0
    : sum;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const likes = blogs.map(el => el.likes);
  const maxLikes = [blogs.find(el => el.likes === Math.max(...likes))];
  const favBlog = maxLikes.map(el => {
    return {
      title: el.title,
      author: el.author,
      likes: el.likes
    };
  });

  return favBlog;
};

const mostBlogs = (blogs) => {
  const group = _.groupBy(blogs, 'author');
  const authors = _.mapValues(group, blogs => blogs.length);
  const mapped = _.map(authors, (blogs, author) => {
    return {
      author,
      blogs
    };
  });
  const mostBlogger = _.maxBy(mapped, 'blogs');

  return mostBlogger;
};

const mostLikes = (blogs) => {
  const group = _.groupBy(blogs, 'author');
  const countLikes = _.mapValues(group, blogs => {
    return _.sumBy(blogs, 'likes');
  });

  const mapped = _.map(countLikes, (likes, author) => {
    return {
      author,
      likes
    };
  });

  const likest = _.maxBy(mapped, 'likes');

  return likest;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
