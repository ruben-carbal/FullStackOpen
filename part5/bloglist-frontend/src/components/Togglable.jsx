import { useState, forwardRef, useImperativeHandle } from 'react';

export const Togglable = forwardRef(({ children }, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return { toggleVisibility };
  });

  return(
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>new note</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={() => {setVisible(false);}}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';