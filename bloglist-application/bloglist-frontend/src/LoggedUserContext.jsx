import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import loggedUserReducer from './reducers/loggedUserReducer';

export const LoggedUserContext = createContext();

export const LoggedUserContextProvider = (props) => {
  const [loggedUser, loggedUserDispatch] = useReducer(
    loggedUserReducer,
    null
  );

  return (
    <LoggedUserContext.Provider value={[loggedUser, loggedUserDispatch]}>
      {props.children}
    </LoggedUserContext.Provider>
  );
};

LoggedUserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoggedUserContextProvider;
