export const showNotification = (
  dispatch,
  { type, message },
  timeout = 3000
) => {
  dispatch({
    type: 'SET',
    payload: { type, message },
  });

  setTimeout(() => {
    dispatch({ type: 'CLEAR' });
  }, timeout);
};
