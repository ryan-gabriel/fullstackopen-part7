import { useRef } from 'react';
import Blog from './Blog';
import CreateBlogForm from './CreateBlogForm';
import Togglable from './Togglable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs';
import { showNotification } from '../utils/notify';
import { useLoggedUserValue } from '../hook/loggedUser';
import { useNotificationDispatch } from '../hook/notification';
import Loading from './Loading';
import FailedMessage from './FailedMessage';

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

  if (result.isLoading) {
    return <Loading />;
  }

  if (result.isError) {
    return (
      <FailedMessage
        message={`blogs service not available due to problems in server`}
      />
    );
  }

  const addBlog = async (blogObject) => {
    try {
      newBlogMutation.mutate(blogObject);
    } catch (error) {
      showNotification(notificationDispatch, {
        type: 'error',
        message: error.response?.data?.error || 'Failed to create blog',
      });
      throw error;
    }
  };

  const blogs = result.data;

  return (
    <>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <CreateBlogForm createBlog={addBlog} />
      </Togglable>

      <div className="w-100 d-flex flex-column align-items-center">
        {blogs.length === 0 ? (
          <p
            className="text-center bg-dark p-3 rounded"
            style={{ color: '#A9A9A9' }}
          >
            Added Blog
          </p>
        ) : (
          blogs.map((blog) => <Blog key={blog.id} blog={blog} />)
        )}
      </div>
    </>
  );
};

export default Blogs;
