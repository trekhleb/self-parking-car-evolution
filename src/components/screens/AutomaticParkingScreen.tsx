import React from 'react';

import World from '../world/World';
import { styled } from 'baseui';
import ParkingAutomatic from '../world/ParkingAutomatic';

function AutomaticParkingScreen() {
  return (
    <Container>
      <World>
        <ParkingAutomatic />
      </World>
    </Container>
  );
}

const Container = styled('div', {
  height: '400px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
});

export default AutomaticParkingScreen;
