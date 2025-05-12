import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
      <div style={hideWhenVisible}>
        <Button variant="success" onClick={toggleVisibility}>
          {props.buttonLabel} +
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <div className="mt-2">
          <Button variant="danger" size="sm" onClick={toggleVisibility}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
