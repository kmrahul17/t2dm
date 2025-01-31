// src/components/KnownUser.js
import React from 'react';

function KnownUser({ onBack }) {
  return (
    <div className="container">
      <button onClick={onBack} className="button button-back">
        Back
      </button>
      <h2>Known User</h2>
      <p>This feature is coming soon!</p>
    </div>
  );
}

export default KnownUser;