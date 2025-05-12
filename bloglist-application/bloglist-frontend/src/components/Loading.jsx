import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
    const loadingStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    };

    return (
        <div style={loadingStyle}>
            <Spinner />
        </div>
    );
};

export default Loading;
