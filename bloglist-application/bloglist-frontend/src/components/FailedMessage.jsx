const FailedMessage = ({ message }) => {
  const FailedMessageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
  };

  const messageBoxStyle = {
    backgroundColor: '#ff4d4d',
    color: 'white',
    padding: '20px 40px',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
    opacity: 0.9,
    transition: 'opacity 0.5s ease',
  };

  return (
    <div style={FailedMessageStyle}>
      <div style={messageBoxStyle}>{message}</div>
    </div>
  );
};

export default FailedMessage;
