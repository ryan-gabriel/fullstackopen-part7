import { useRef } from 'react';
import Blog from './Blog';
import CreateBlogForm from './CreateBlogForm';
import Togglable from './Togglable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showNotification } from '../utils/notify';
import blogService from '../services/blogs';
import { useLoggedUserValue } from '../hook/loggedUser';
import { useNotificationDispatch } from '../hook/notification';

const Blogs = () => {
  const blogFormRef = useRef();
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const user = useLoggedUserValue();

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

  if (result.isLoading) {
    return <div>loading blogs...</div>;
  }

  if (result.isError) {
    return <div>blogs service not available due to problems in server</div>;
  }

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

  const blogs = result.data;

  return (
    <>
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
    </>
  );
};

export default Blogs;
