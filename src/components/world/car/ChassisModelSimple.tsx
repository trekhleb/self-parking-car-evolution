import React from 'react';
import { GroupProps } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';

import { CHASSIS_HEIGHT, CHASSIS_LENGTH, CHASSIS_WIDTH } from './constants';

type ChassisModelSimpleProps = {
  bodyProps?: GroupProps,
  wireframe?: boolean,
  castShadow?: boolean,
  receiveShadow?: boolean,
  styled?: boolean,
  baseColor?: string,
};

function ChassisModelSimple(props: ChassisModelSimpleProps) {
  const {
    bodyProps = {},
    wireframe = false,
    styled = true,
    castShadow = true,
    receiveShadow = true,
    baseColor: color,
  } = props;

  const boxArgs: number[] = [
    CHASSIS_WIDTH - 0.2,
    CHASSIS_HEIGHT - 0.4,
    CHASSIS_LENGTH - 0.2,
  ];

  const [boxRef] = useBox(() => ({
    args: boxArgs,
  }));

  return (
    <mesh ref={boxRef} castShadow={castShadow} receiveShadow={receiveShadow} >
      <boxBufferGeometry
        // @ts-ignore
        args={boxArgs}
      />
      <meshPhysicalMaterial color={color} />
    </mesh>
  );
}

export default ChassisModelSimple;
