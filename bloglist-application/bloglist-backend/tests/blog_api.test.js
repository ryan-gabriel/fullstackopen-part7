const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('node:assert');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  // Initial user
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();

  const userId = user._id;

  const blogObjects = helper.initialBlogs.map((blog) => ({
    ...blog,
    userId: userId,
  }));

  const promiseArray = blogObjects.map((blog) => new Blog(blog).save());
  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('return the correct amount of blogs', async () => {
  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, 2);
});

test('verifies that the unique identifier property of the blog posts is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogData = response.body[0];

  assert.ok(blogData.id);
  assert.strictEqual(blogData._id, undefined);
});

test('creates a new blog post', async () => {
  const token = await helper.loginAsRoot();

  const blog = {
    title: 'Title',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, 3);
});

test('creates a blog post without token', async () => {
  const blog = {
    title: 'Title',
    author: 'John Doe',
    url: 'http://example.com',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(401)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  assert.strictEqual(response.body.length, 2);
});

test('default of likes property is 0', async () => {
  const token = await helper.loginAsRoot();

  const blog = {
    title: 'Title',
    author: 'John Doe',
    url: 'http://example.com',
  };
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test('verify missing properties from request data', async () => {
  const token = await helper.loginAsRoot();

  const blog = {
    author: 'John Doe',
    url: 'http://example.com',
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)
    .expect(400);
});

test('deletes a blog post by its creator', async () => {
  const token = await helper.loginAsRoot();

  const newBlog = {
    title: 'Delete Test',
    author: 'Tester',
    url: 'http://delete.com',
  };

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  const blogId = postResponse.body.id;

  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

  const after = await api.get('/api/blogs');
  const ids = after.body.map((b) => b.id);
  assert.strictEqual(ids.includes(blogId), false);
});

test('fails to delete blog if not creator', async () => {
  const rootToken = await helper.loginAsRoot();
  const user2 = await helper.createUserAndLogin('stranger', 'password2');

  const newBlog = {
    title: 'Unauthorized Delete',
    author: 'Owner',
    url: 'http://deletefail.com',
  };

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${rootToken}`)
    .send(newBlog)
    .expect(201);

  const blogId = postResponse.body.id;

  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${user2.token}`)
    .expect(401);

  const after = await api.get('/api/blogs');
  const ids = after.body.map((b) => b.id);
  assert.strictEqual(ids.includes(blogId), true);
});

test('update blog post by its creator', async () => {
  const token = await helper.loginAsRoot();

  const newBlog = {
    title: 'Initial Blog Post',
    author: 'Root User',
    url: 'http://example.com/initial',
    likes: 0,
  };

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogId = postResponse.body.id;

  const blogsResponse = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(blogsResponse.body.length, 3);

  const updatedBlog = {
    title: 'Updated Blog Post Title',
    author: 'Root User',
    url: 'http://example.com/updated',
    likes: 10,
  };

  await api
    .put(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlog)
    .expect(204);

  const afterResponse = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const updatedBlogTitles = afterResponse.body.map((blog) => blog.title);
  assert.strictEqual(
    updatedBlogTitles.includes('Updated Blog Post Title'),
    true
  );
});

test('fails to update blog if not creator', async () => {
  const token = await helper.loginAsRoot();

  const newBlog = {
    title: 'Initial Blog Post',
    author: 'Root User',
    url: 'http://example.com/initial',
    likes: 0,
  };

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogId = postResponse.body.id;

  const blogsResponse = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(blogsResponse.body.length, 3);

  const user2 = await helper.createUserAndLogin('stranger', 'password2');

  const updatedBlog = {
    title: 'Updated Blog Post Title',
    author: 'Root User',
    url: 'http://example.com/updated',
    likes: 10,
  };

  await api
    .put(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${user2.token}`)
    .send(updatedBlog)
    .expect(401);

  const afterResponse = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const updatedBlogTitles = afterResponse.body.map((blog) => blog.title);
  assert.strictEqual(
    updatedBlogTitles.includes('Updated Blog Post Title'),
    false
  );
});

after(async () => {
  await mongoose.connection.close();
});
