import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import CreateBlogForm from './components/CreateBlogForm';
import LoginForm from './components/LoginForm';
import logoutService from './services/auth/logout';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successCreateMessage, setSuccessCreateMessage] = useState(null);

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();
    logoutService.logout();
    setUser(null);
    setUsername('');
    setPassword('');
  };

  const blogFormRef = useRef();

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const createdBlog = await blogService.create(blogObject);
      console.log(createdBlog);
      setBlogs(blogs.concat(createdBlog));
      setSuccessCreateMessage(
        `A new blog "${blogObject.title}" by ${blogObject.author} added`
      );

      setTimeout(() => {
        setSuccessCreateMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      throw error;
    }
  };

  const updateLike = async (id) => {
    try {
      const blogToUpdate = await blogService.getBlog(id);
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      };

      const response = await blogService.updateLike(id, updatedBlog);
      console.log(response);

      setBlogs(
        blogs
          .map((b) => (b.id === id ? response : b))
          .sort((a, b) => b.likes - a.likes)
      );
    } catch (error) {
      console.error('Failed to update likes', error);
    }
  };

  const deleteBlog = async (id, title, author) => {
    try {
      if (window.confirm(`Remove blog ${title} by ${author}`)) {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter((blog) => blog.id !== id));
      }
    } catch (e) {
      setErrorMessage('Failed to delete blog');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  if (user === null) {
    return (
      <div>
        {errorMessage && <Notification message={errorMessage} type="error" />}
        <LoginForm setErrorMessage={setErrorMessage} setUser={setUser} />
      </div>
    );
  }

  return (
    <div>
      {successCreateMessage && (
        <Notification message={successCreateMessage} type="success" />
      )}
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>Log Out</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          loggedUser={user}
          blog={blog}
          updateLike={updateLike}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
