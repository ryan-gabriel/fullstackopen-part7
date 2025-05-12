import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title,
        author,
        url,
      };
      await createBlog(newBlog);
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create New</h2>
      <Form onSubmit={addBlog}>
        <Form.Group as={Row} className="mb-3" controlId="formTitle">
          <Form.Label column sm="3">
            Title
          </Form.Label>
          <Col sm="9">
            <Form.Control
              data-testid="title"
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Enter blog title here"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formAuthor">
          <Form.Label column sm="3">
            Author
          </Form.Label>
          <Col sm="9">
            <Form.Control
              data-testid="author"
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="Enter blog author here"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formUrl">
          <Form.Label column sm="3">
            URL
          </Form.Label>
          <Col sm="9">
            <Form.Control
              data-testid="url"
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
              placeholder="Enter blog URL here"
            />
          </Col>
        </Form.Group>

        <div className="text-end">
          <Button variant="primary" type="submit">
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};

CreateBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default CreateBlogForm;
