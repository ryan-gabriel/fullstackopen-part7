import PropTypes from 'prop-types';
import { useState } from 'react';

const Blog = ({ loggedUser, blog, updateLike, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    try {
      await updateLike(blog.id);
    } catch (error) {
      setLikes(likes);
      console.error('Failed to update like', error);
    }
  };

  return (
    <div style={blogStyle}>
      <div className="blogHeader">
        {blog.title} {blog.author}{' '}
        <button className="toggle-btn" onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible} className="blogDetail">
        {blog.url} <br />
        likes {likes}{' '}
        <button className="like-button" onClick={handleLike}>
          like
        </button>{' '}
        <br />
        {blog.user.name == loggedUser.name && (
          <button onClick={() => deleteBlog(blog.id, blog.title, blog.author)}>
            remove
          </button>
        )}
        <br />
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  loggedUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
