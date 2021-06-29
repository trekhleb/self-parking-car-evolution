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

const innerW = 1.2;
const innerL = 2.44;

const innerX = x + (outerW - innerW) / 2;
const innerY = y;
const innerZ = z + (outerL - innerL) / 2;

const outerCorners: [number, number, number][] = [
  [x + outerW, y, z + outerL], // Front-left
  [x, y, z + outerL], // Front-right
  [x, y, z], // Back-right
  [x + outerW, y, z], // Back-left
];

const innerCorners: [number, number, number][] = [
  [innerX + innerW, innerY, innerZ + innerL], // Front-left
  [innerX, innerY, innerZ + innerL], // Front-right
  [innerX, innerY, innerZ], // Back-right
  [innerX + innerW, innerY, innerZ], // Back-left
];

export const PARKING_SPOT_POINTS: RectanglePoints = {
  fl: [innerX + innerW, innerY, innerZ + innerL],
  fr: [innerX, innerY, innerZ + innerL],
  br: [innerX, innerY, innerZ],
  bl: [innerX + innerW, innerY, innerZ],
};

const innerLineVisible = false;

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
