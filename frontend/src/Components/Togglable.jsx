import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types'
//forward ref is used to pass down a ref from parent to child
const Togglable = forwardRef(({quitButtonLabel, buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false);

  //defines required props 
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
  }
  const toggleVisibility = () =>{
    setVisible(!visible)
  }


  //used to attach the child method to the ref so that it can be used in the parent
  useImperativeHandle(refs, ()=>{
    return{
        toggleVisibility
    }
  })
  return (
    <div>
      {visible ? (
        <div className='togglableContent'>
          {children}
          <button onClick={toggleVisibility}>{quitButtonLabel}</button> {/* Correct toggle logic */}
        </div>
      ) : (
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      )}
    </div>
  );
});
Togglable.displayName = 'Togglable'


export default Togglable;
