import React from 'react';

import World from '../world/World';
import ParkingManual from '../world/ParkingManual';
import { styled } from 'baseui';

function ManualParkingScreen() {
  return (
    <Container>
      <World>
        <ParkingManual />
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

export default ManualParkingScreen;
