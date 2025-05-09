import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import notificationReducer from './reducers/notificationReducer';

export const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationContextProvider;
