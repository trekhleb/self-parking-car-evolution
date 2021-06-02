import React from 'react';
import { Line } from '@react-three/drei';

import { CHASSIS_LENGTH, CHASSIS_WIDTH } from '../car/constants';
import { NumVec3 } from '../types/vectors';

type ParkingSpotProps = {
  position: NumVec3,
  color?: string,
};

function ParkingSpot(props: ParkingSpotProps) {
  const { position, color = 'yellow' } = props;

  const [x, y, z] = position;

  const margin = 0.3;
  const w = CHASSIS_WIDTH + margin;
  const l = CHASSIS_LENGTH + margin;

  return (
    <Line
      points={[
        [x, y, z],
        [x + w, y, z],
        [x + w, y, z + l],
        [x, y, z + l],
        [x, y, z],
      ]}
      color={color}
      lineWidth={2}
      dashed={false}
    />
  );
}

export default ParkingSpot;
