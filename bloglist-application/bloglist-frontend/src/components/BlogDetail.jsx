import { useNavigate, useParams } from 'react-router-dom';
import blogService from '../services/blogs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLoggedUserValue } from '../hook/loggedUser';
import { showNotification } from '../utils/notify';
import { useEffect, useState } from 'react';

const BlogDetail = () => {
  const blogId = useParams().id;
  const queryClient = useQueryClient();
  const loggedUser = useLoggedUserValue();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const blogResponse = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogService.getBlog(blogId),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (blogResponse.data) {
      setComments(blogResponse.data.comments || []);
    }
  }, [blogResponse.data]);

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
      navigate('/');
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

  const handleComment = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = '';
    await blogService.addComment(comment, blog.id);
    setComments([...comments, comment]);
  };

  return (
    <>
      <h1>
        {blog.title} {blog.author}
      </h1>
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
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input type="text" id="comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li>{comment}</li>
        ))}
      </ul>
    </>
  );
};

export default BlogDetail;
