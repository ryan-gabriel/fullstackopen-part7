import { useEffect } from 'react';
import LoginForm from './components/LoginForm';
import logoutService from './services/auth/logout';
import Notification from './components/Notification';
import { useLoggedUserDispatch, useLoggedUserValue } from './hook/loggedUser';
import { Routes, Route, Link } from 'react-router-dom';
import Blogs from './components/Blogs';
import Users from './components/Users';
import UserDetail from './components/UserDetail';
import BlogDetail from './components/BlogDetail';

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
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Log Out</button>
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>
    </div>
  );
};

export default App;
