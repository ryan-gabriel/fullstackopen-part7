import React from 'react';
import { useNotificationValue } from '../hook/notification';

const Notification = () => {
  const notificationValue = useNotificationValue();

  if (!notificationValue) return null;

  const messageStyle = {
    color: notificationValue.type === 'error' ? 'red' : 'green',
    background: '#f0f0f0',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={messageStyle}>{notificationValue.message}</div>;
};

export default Notification;
