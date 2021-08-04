import React from 'react';

import World from '../world/World';
import ParkingManual from '../world/parkings/ParkingManual';

function EvolutionTabManual() {
  return (
    <World
      withJoystickControl
      withKeyboardControl
    >
      <ParkingManual
        withLabels
        withSensors
      />
    </World>
  );
}

export default EvolutionTabManual;
