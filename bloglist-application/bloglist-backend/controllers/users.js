const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  });
  return response.json(users);
});

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id);
    if (user) {
      response.json(user);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body;

    if (!username || !name || !password) {
      return response.status(400).json({ Error: 'Missing values' });
    }

    if (password.length < 3) {
      return response
        .status(400)
        .json({ Error: 'Password must be at least 3 characters long' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    await User.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
