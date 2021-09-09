import React from 'react';
import { Line } from '@react-three/drei';
import { PARKING_SPOT_INNER_CORNERS, PARKING_SPOT_OUTER_CORNERS } from '../constants/parking';

type ParkingSpotProps = {
  color?: string,
};

// @TODO: Parking lot size should be a configurable from the outside.
// Move this constants to the component parameters.

const innerLineVisible = false;

function ParkingSpot(props: ParkingSpotProps) {
  const { color = 'yellow' } = props;

  const innerLineComponent = innerLineVisible ? (
    <Line
      points={[
        ...PARKING_SPOT_INNER_CORNERS,
        PARKING_SPOT_INNER_CORNERS[0], // Closing the line.
      ]}
      color={color}
      lineWidth={4}
      dashed={false}
    />
  ) : null;

  return (
    <>
      <Line
        points={[
          ...PARKING_SPOT_OUTER_CORNERS,
          PARKING_SPOT_OUTER_CORNERS[0], // Closing the line.
        ]}
        color={color}
        lineWidth={4}
        dashed={false}
      />
      {innerLineComponent}
    </>
  );
}

export default ParkingSpot;
