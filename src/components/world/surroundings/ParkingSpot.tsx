import React from 'react';
import { Line } from '@react-three/drei';

import { CHASSIS_LENGTH, CHASSIS_WIDTH } from '../car/constants';
import { NumVec3 } from '../types/vectors';
import { Vector3 } from 'three';

type ParkingSpotProps = {
  color?: string,
};

const PARKING_SPOT_POSITION: NumVec3 = [-3.6, 0, -2.1];

const [x, y, z] = PARKING_SPOT_POSITION;

const margin = 0.3;
const w = CHASSIS_WIDTH + margin;
const l = CHASSIS_LENGTH + margin;

export const PARKING_SPOT_CORNERS: Array<Vector3 | [number, number, number]> = [
  [x, y, z],
  [x + w, y, z],
  [x + w, y, z + l],
  [x, y, z + l],
];

function ParkingSpot(props: ParkingSpotProps) {
  const { color = 'yellow' } = props;
  return (
    <Line
      points={[
        ...PARKING_SPOT_CORNERS,
        PARKING_SPOT_CORNERS[0], // Closing the line.
      ]}
      color={color}
      lineWidth={4}
      dashed={false}
    />
  );
}

export default ParkingSpot;
