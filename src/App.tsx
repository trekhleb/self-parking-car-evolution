import React from 'react';

import './App.css';
import ParkingLot from './components/ParkingLot';

function App() {
  return (
    <div style={{height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
      <ParkingLot />
    </div>
  );
}

export default App;
