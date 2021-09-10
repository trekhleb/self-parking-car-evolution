import React from 'react';
import { GroupProps } from '@react-three/fiber';

import { WHEEL_WIDTH, WHEEL_RADIUS } from './constants';

type WheelModelSimpleProps = {
  castShadow?: boolean,
  receiveShadow?: boolean,
  groupProps?: GroupProps,
  styled?: boolean,
  wireframe?: boolean,
  baseColor?: string,
};

function WheelModelSimple(props: WheelModelSimpleProps) {
  const {
    castShadow = true,
    receiveShadow = true,
    baseColor: color,
  } = props;

  const cylinderArgs: [number, number, number, number] = [
    WHEEL_RADIUS,
    WHEEL_RADIUS,
    WHEEL_WIDTH,
    20,
  ];

  return (
    <mesh castShadow={castShadow} receiveShadow={receiveShadow} >
      <cylinderBufferGeometry args={cylinderArgs} />
      <meshPhysicalMaterial color={color} />
    </mesh>
  );
}

export default WheelModelSimple;
