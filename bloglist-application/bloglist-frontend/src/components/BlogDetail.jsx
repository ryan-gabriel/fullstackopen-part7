import { useNavigate, useParams } from 'react-router-dom';
import blogService from '../services/blogs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLoggedUserValue } from '../hook/loggedUser';
import { showNotification } from '../utils/notify';
import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  ListGroup,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import Loading from './Loading';
import FailedMessage from './FailedMessage';

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

  if (blogResponse.isLoading) return <Loading />;
  if (blogResponse.isError)
    return <FailedMessage message={'Failed to fetch blog'} />;

  const blog = blogResponse.data;

  const handleComment = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = '';
    await blogService.addComment(comment, blog.id);
    setComments([...comments, comment]);
  };

  return (
    <Container className="mt-5">
      <Card className="mb-4 bg-dark text-light">
        <Row className="justify-content-center mb-4">
          <Col xs="auto">
            <h1 className="text-light text-center">
              {blog.title} by {blog.author}
            </h1>
          </Col>
        </Row>
        <Card.Body>
          <Card.Text className="mb-3">
            URL:{' '}
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-light"
            >
              {blog.url}
            </a>
          </Card.Text>
          <Card.Text>
            {blog.likes} likes
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="ms-2"
            >
              Like
            </Button>
          </Card.Text>
          <Card.Text>Added by {blog.user.name}</Card.Text>
          {blog.user.name === loggedUser.name && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => deleteBlog(blog.id, blog.title, blog.author)}
            >
              Remove
            </Button>
          )}
        </Card.Body>
      </Card>

      <Row className="mb-4">
        <Col>
          <h3 className="text-light">Comments</h3>
          <Form onSubmit={handleComment}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                id="comment"
                placeholder="Add a comment"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Comment
            </Button>
          </Form>
        </Col>
      </Row>

      <ListGroup className="bg-dark text-light">
        {comments.map((comment, index) => (
          <ListGroup.Item key={index} className="bg-dark text-light">
            {comment}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default BlogDetail;
