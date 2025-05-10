const initialState = null

const loggedUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        name: action.payload.name,
        username: action.payload.username,
        token: action.payload.token
      };
    case 'CLEAR_USER':
      return null;
    default:
      return state;
  }
};

export default loggedUserReducer;
