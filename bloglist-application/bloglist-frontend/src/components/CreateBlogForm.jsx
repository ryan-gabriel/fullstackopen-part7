import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
    <div>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            data-testid="title"
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Enter blog title here"
          />
        </div>
        <div>
          author
          <input
            data-testid="author"
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Enter blog author here"
          />
        </div>
        <div>
          url
          <input
            data-testid="url"
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="Enter blog url here"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

CreateBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default CreateBlogForm;
