import { useState } from 'react';
import loginService from '../services/auth/login';
import PropTypes from 'prop-types';
import { useNotificationDispatch } from '../hook/notification';
import { showNotification } from '../utils/notify';
import { useLoggedUserDispatch } from '../hook/loggedUser';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const notificationDispatch = useNotificationDispatch();
  const loggedUserDispatch = useLoggedUserDispatch();
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
      loggedUserDispatch({
        type: 'SET_USER',
        payload: user,
      });
      setUsername('');
      setPassword('');
    } catch (error) {
      showNotification(notificationDispatch, {
        type: 'error',
        message: 'Wrong username or password',
      });
    }
  };
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            data-testid="username"
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            data-testid="password"
            id="password"
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
