const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  return response.json(blogs);
});

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', {
      username: 1,
      name: 1,
    });
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body;

    if (!body.title || !body.author || !body.url) {
      return response.status(400).json({ error: 'Missing values' });
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(404).json({ Error: 'User not found' });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog.id);

    await user.save();

    const populatedBlog = await savedBlog.populate('user', {
      username: 1,
      name: 1,
    });
    response.status(201).json(populatedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    const blog = await Blog.findById(request.params.id);

    if (decodedToken.id.toString() != blog.user.toString()) {
      return response
        .status(401)
        .json({ error: 'User not allowed to delete this blog' });
    }

    await blog.deleteOne();

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { title, author, url, likes, user } = request.body;

    if (!title || !author || !url || likes === undefined) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    const blogToUpdate = {
      title,
      author,
      url,
      likes,
      user,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blogToUpdate,
      {
        new: true,
      }
    ).populate('user', { username: 1, name: 1 });

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
