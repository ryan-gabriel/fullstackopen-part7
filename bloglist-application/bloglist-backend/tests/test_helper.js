const Blog = require('../models/blog');
const User = require('../models/user');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Alice',
    url: 'http://example.com/html',
    likes: 5,
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Bob',
    url: 'http://example.com/js',
    likes: 10,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'Ghost',
    url: 'http://temp.com',
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const rootUser = {
  username: 'root',
  password: 'sekret',
};

const createUserAndLogin = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash });
  await user.save();

  const loginResponse = await supertest(require('../app'))
    .post('/api/login')
    .send({ username, password });

  return {
    token: loginResponse.body.token,
    id: loginResponse.body.id,
    username,
  };
};

const loginAsRoot = async () => {
  const response = await api
    .post('/api/login')
    .send(rootUser)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  return response.body.token;
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  rootUser,
  createUserAndLogin,
  loginAsRoot,
};
