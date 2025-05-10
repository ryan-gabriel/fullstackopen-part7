import { useNavigate, useParams } from 'react-router-dom';
import blogService from '../services/blogs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLoggedUserValue } from '../hook/loggedUser';
import { showNotification } from '../utils/notify';

const BlogDetail = () => {
  const blogId = useParams().id;
  const queryClient = useQueryClient();
  const loggedUser = useLoggedUserValue();
  const navigate = useNavigate();
  const blogResponse = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogService.getBlog(blogId),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const oldBlog = queryClient.getQueryData(['blog', blogId]);
      const updatedBlog = {
        ...oldBlog,
        likes: oldBlog.likes + 1,
        user: oldBlog.user.id,
      };
      return blogService.updateLike({ id: blogId, blog: updatedBlog });
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blog', blogId], updatedBlog);
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
      navigate('/')
    },
  });

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

  if (blogResponse.isLoading) return <div>Loading blog...</div>;
  if (blogResponse.isError) return <div>Failed to fetch blog</div>;

  const blog = blogResponse.data;

  return (
    <>
      <h1>{blog.title} {blog.author}</h1>
      <a href={blog.url} target="_blank">
        {blog.url}
      </a>
      <p>
        {blog.likes} likes
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
        >
          like
        </button>
      </p>
      <p>added by {blog.user.name}</p>
      {blog.user.name == loggedUser.name && (
        <button onClick={() => deleteBlog(blog.id, blog.title, blog.author)}>
          remove
        </button>
      )}
    </>
  );
};

export default BlogDetail;
