const initialState = null

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET':
      return {
        type: action.payload.type,
        message: action.payload.message,
      };
    case 'CLEAR':
      return null;
    default:
      return state;
  }
};

export default notificationReducer;
