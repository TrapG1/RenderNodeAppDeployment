import { useState, forwardRef, useImperativeHandle } from 'react';

//forward ref is used to pass down a ref from parent to child
const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false);

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
        <div>
          {children}
          <button onClick={toggleVisibility}>Cancel</button> {/* Correct toggle logic */}
        </div>
      ) : (
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      )}
    </div>
  );
});

export default Togglable;
