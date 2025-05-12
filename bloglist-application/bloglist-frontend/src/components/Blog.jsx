import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Blog = ({ blog }) => {
  const [isHovered, setIsHovered] = useState(false);

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '15px',
    border: '1px solid #14FFEC',
    marginBottom: 10  ,
    textAlign: 'center',
    position: 'relative',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    width: '95%',
  };

  const hoveredLinkStyle = {
    ...linkStyle,
    backgroundColor: '#14FFEC',
    color: 'black',
  };

  return (
    <Link
      to={`/blogs/${blog.id}`}
      style={isHovered ? hoveredLinkStyle : linkStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {blog.title} {blog.author}
    </Link>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
