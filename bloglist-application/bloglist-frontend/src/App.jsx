import { useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import { useLoggedUserDispatch, useLoggedUserValue } from './hook/loggedUser';
import { Routes, Route } from 'react-router-dom';
import Blogs from './components/Blogs';
import Users from './components/Users';
import UserDetail from './components/UserDetail';
import BlogDetail from './components/BlogDetail';
import Navigation from './components/Navigation';

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
      <Navigation user={user}/>
      <Notification />
      <h2 className='text-center'>Blog Application</h2>
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
