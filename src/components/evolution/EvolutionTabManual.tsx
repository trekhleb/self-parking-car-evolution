import React from 'react';
import { Block } from 'baseui/block';
import { Notification } from 'baseui/notification';

import World from '../world/World';
import ParkingManual from '../world/parkings/ParkingManual';

function EvolutionTabManual() {
  return (
    <Block>
      <World
        performanceBoost={false}
        withJoystickControl
        withKeyboardControl
      >
        <ParkingManual
          performanceBoost={false}
          withLabels
          withSensors
        />
      </World>
      <Block marginTop="20px">
        <Notification overrides={{Body: {style: {width: 'auto'}}}}>
          Try to park the car by yourself<br/><br/>
          <small>WASD keys to drive, SPACE to break, Joystick for mobile</small>
        </Notification>
      </Block>
    </Block>
  );
}

export default EvolutionTabManual;
