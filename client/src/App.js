// App.js
import React, { useState } from 'react';
import UserType from './components/UserType';
import NewUser from './components/NewUser';
import KnownUser from './components/KnownUser';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('userType');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderView = () => {
    switch(currentView) {
      case 'newUser':
        return <NewUser onBack={() => setCurrentView('userType')} />;
      case 'knownUser':
        return <KnownUser onBack={() => setCurrentView('userType')} />;
      default:
        return <UserType onSelection={setCurrentView} />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <button onClick={toggleDarkMode} className="button button-secondary">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {renderView()}
    </div>
  );
}

export default App;