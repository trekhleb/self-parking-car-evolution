import React from 'react';
import { Line } from '@react-three/drei';

import { CHASSIS_LENGTH, CHASSIS_WIDTH } from '../car/constants';
import { NumVec3, RectanglePoints } from '../types/vectors';

type ParkingSpotProps = {
  color?: string,
};

// @TODO: Parking lot size should be a configurable from the outside.
// Move this constants to the component parameters.

// const PARKING_SPOT_POSITION: NumVec3 = [-0.91, 0, -2];
const PARKING_SPOT_POSITION: NumVec3 = [-3.6, 0, -2.1];

const [x, y, z] = PARKING_SPOT_POSITION;

const outerW = CHASSIS_WIDTH + 0.3;
const outerL = CHASSIS_LENGTH + 0.3;

const innerW = 0.85 * CHASSIS_WIDTH;
const innerL = 0.65 * CHASSIS_LENGTH;

const innerX = x + (outerW - innerW) / 2;
const innerY = y;
const innerZ = z + (outerL - innerL) / 2;

const outerCorners: [number, number, number][] = [
  [x + outerW, y, z],
  [x + outerW, y, z + outerL],
  [x, y, z + outerL],
  [x, y, z],
];

const innerCorners: [number, number, number][] = [
  [innerX + innerW, innerY, innerZ],
  [innerX + innerW, innerY, innerZ + innerL],
  [innerX, innerY, innerZ + innerL],
  [innerX, innerY, innerZ],
];

export const PARKING_SPOT_POINTS: RectanglePoints = {
  fl: [innerX + innerW, innerY, innerZ],
  fr: [innerX + innerW, innerY, innerZ + innerL],
  bl: [innerX, innerY, innerZ + innerL],
  br: [innerX, innerY, innerZ],
};

const innerLineVisible = true;

function ParkingSpot(props: ParkingSpotProps) {
  const { color = 'yellow' } = props;

  const innerLineComponent = innerLineVisible ? (
    <Line
      points={[
        ...innerCorners,
        innerCorners[0], // Closing the line.
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
          ...outerCorners,
          outerCorners[0], // Closing the line.
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
