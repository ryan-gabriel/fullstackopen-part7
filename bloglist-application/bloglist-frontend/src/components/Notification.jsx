import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, type }) => {
  const messageStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: '#f0f0f0',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return <div style={messageStyle}>{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'success']).isRequired,
};

export default Notification;
