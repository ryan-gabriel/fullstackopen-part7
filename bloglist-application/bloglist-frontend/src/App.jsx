import { useEffect } from 'react';
import LoginForm from './components/LoginForm';
import logoutService from './services/auth/logout';
import Notification from './components/Notification';
import { useLoggedUserDispatch, useLoggedUserValue } from './hook/loggedUser';
import { Routes, Route, Link } from 'react-router-dom';
import Blogs from './components/Blogs';
import Users from './components/Users';

const App = () => {
  const user = useLoggedUserValue();
  const loggedUserDispatch = useLoggedUserDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      loggedUserDispatch({
        type: 'SET_USER',
        payload: user,
      });
    }
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();
    logoutService.logout();
    loggedUserDispatch({
      type: 'CLEAR_USER',
    });
  };

  if (user === null) {
    return (
      <div>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>Log Out</button>
      </p>
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  );
};

export default App;
