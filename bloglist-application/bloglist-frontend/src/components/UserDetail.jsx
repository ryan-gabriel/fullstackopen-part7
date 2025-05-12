import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { Link, useParams } from 'react-router-dom';
import { Container, Card, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import Loading from './Loading';
import FailedMessage from './FailedMessage';

const UserDetail = () => {
  const userId = useParams().id;
  const user = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const [hovered, setHovered] = useState(null);

  if (user.isLoading) {
    return <Loading />;
  }

  if (user.isError) {
    return <FailedMessage message={'Failed to fetch user'} />;
  }

  return (
    <Container className="my-4">
      <Card bg="dark" text="light" className="text-center">
        <Card.Body>
          <Card.Title className="display-6">{user.data.name}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {user.data.blogs.length === 0 ? (
              <div className="text-center py-4">
                <p
                  className="text-center bg-dark p-3 rounded"
                  style={{ color: '#A9A9A9' }}
                >
                  This User hasn't added any blog yet...
                </p>
              </div>
            ) : (
              <p
                className="text-center bg-dark p-3 rounded"
                style={{ color: '#A9A9A9' }}
              >
                Added Blog
              </p>
            )}
          </Card.Subtitle>

          <ListGroup variant="flush">
            {user.data.blogs.map((blog) => (
              <ListGroup.Item
                key={blog.id}
                className={`d-flex justify-content-center align-items-center py-3 my-2 ${
                  hovered === blog.id
                    ? 'bg-info text-dark border-0'
                    : 'bg-dark text-light border-1 border-secondary'
                }`}
                as={Link}
                to={`/blogs/${blog.id}`}
                onMouseEnter={() => setHovered(blog.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderRadius: '5px',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                }}
              >
                {blog.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDetail;
