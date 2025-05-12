import { useState } from 'react';
import loginService from '../services/auth/login';
import { useNotificationDispatch } from '../hook/notification';
import { showNotification } from '../utils/notify';
import { useLoggedUserDispatch } from '../hook/loggedUser';
import { Form, Button, Container, Card } from 'react-bootstrap';

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
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <Card className="p-4" style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Log in to application</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                data-testid="username"
                type="text"
                value={username}
                name="username"
                onChange={({ target }) => setUsername(target.value)}
                placeholder="Enter your username"
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                data-testid="password"
                type="password"
                value={password}
                name="password"
                onChange={({ target }) => setPassword(target.value)}
                placeholder="Enter your password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;
