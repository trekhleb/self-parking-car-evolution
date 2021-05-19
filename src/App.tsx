import React from 'react';

import './App.css';
import World from './components/world/World';

function App() {
  return (
    <div style={{height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
      <World />
    </div>
  );
}

export default App;
