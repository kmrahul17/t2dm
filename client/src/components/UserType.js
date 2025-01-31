import React from 'react';

function UserType({ onSelection }) {
  return (
    <div className="container">
      <button 
        onClick={() => onSelection('newUser')}
        className="button button-primary"
      >
        New User
      </button>
      <button 
        onClick={() => onSelection('knownUser')}
        className="button button-secondary"
      >
        Known User
      </button>
    </div>
  );
}

export default UserType;