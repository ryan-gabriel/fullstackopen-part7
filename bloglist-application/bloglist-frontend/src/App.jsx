import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import CreateBlogForm from './components/CreateBlogForm';
import LoginForm from './components/LoginForm';
import logoutService from './services/auth/logout';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { useNotificationDispatch } from './hook/notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showNotification } from './utils/notify';
import { useLoggedUserDispatch, useLoggedUserValue } from './hook/loggedUser';

const App = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();
  const user = useLoggedUserValue();
  const loggedUserDispatch = useLoggedUserDispatch();
  const blogFormRef = useRef();

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

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs']) || [];
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog));
      blogFormRef.current.toggleVisibility();
      showNotification(notificationDispatch, {
        type: 'success',
        message: `A new blog "${newBlog.title}" by ${newBlog.author} added`,
      });
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: blogService.updateLike,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs']) || [];
      queryClient.setQueryData(
        ['blogs'],
        blogs
          .map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
          .sort((a, b) => b.likes - a.likes)
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (deletedBlogId) => {
      const blogs = queryClient.getQueryData(['blogs']) || [];
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== deletedBlogId)
      );
    },
  });

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogs = await blogService.getAll();
      return blogs.sort((a, b) => b.likes - a.likes);
    },
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!user,
  });

  const handleLogout = async (event) => {
    event.preventDefault();
    logoutService.logout();
    loggedUserDispatch({
      type: 'CLEAR_USER',
    });
  };

  const addBlog = async (blogObject) => {
    try {
      newBlogMutation.mutate(blogObject);
    } catch (error) {
      showNotification(notificationDispatch, {
        type: 'error',
        message: error.response.data.error,
      });
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

      updateBlogMutation.mutate({ id, blog: updatedBlog });
    } catch (error) {
      console.error('Failed to update likes', error);
    }
  };

  const deleteBlog = async (id, title, author) => {
    try {
      if (window.confirm(`Remove blog ${title} by ${author}`)) {
        deleteBlogMutation.mutate(id);
      }
    } catch (e) {
      showNotification(notificationDispatch, {
        type: 'error',
        message: `Failed to delete blog`,
      });
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  if (result.isLoading) {
    return <div>loading blogs...</div>;
  }

  if (result.isError) {
    return <div>blogs service not available due to problems in server</div>;
  }

  const blogs = result.data;

  return (
    <div>
      <Notification />
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
