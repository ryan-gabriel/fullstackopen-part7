const logout = () => {
  window.localStorage.removeItem('loggedNoteappUser');
};

export default { logout };
