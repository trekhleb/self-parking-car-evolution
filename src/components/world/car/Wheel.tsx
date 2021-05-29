import React, { forwardRef } from 'react';
import { useCylinder, CylinderProps } from '@react-three/cannon';
import * as THREE from 'three';

import { NumVec3, NumVec4 } from '../../../types/vectors';
import { WHEEL_MASS, WHEEL_WIDTH } from './constants';
import WheelModel from './WheelModel';

type WheelProps = {
  radius: number,
  mass?: number,
  width?: number,
  segments?: number,
  castShadow?: boolean,
  receiveShadow?: boolean,
  isLeft?: boolean,
  styled?: boolean,
  wireframe?: boolean,
  baseColor?: string,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
  bodyProps?: CylinderProps,
}

const Wheel = forwardRef<THREE.Object3D | undefined, WheelProps>((props, ref) => {
  const {
    radius,
    width = WHEEL_WIDTH,
    mass = WHEEL_MASS,
    segments = 16,
    castShadow = true,
    receiveShadow = true,
    isLeft = false,
    styled = true,
    wireframe = false,
    bodyProps = {},
    baseColor,
  } = props;

  const wheelSize: NumVec4 = [radius, radius, width, segments];

  // The rotation should be applied to the shape (not the body).
  const rotation: NumVec3 = [0, 0, ((isLeft ? 1 : -1) * Math.PI) / 2];

  useCylinder(
    () => ({
      mass,
      type: 'Kinematic',
      collisionFilterGroup: 0,
      args: wheelSize,
      ...bodyProps,
    }),
    // @ts-ignore
    ref,
  )

  return (
    <mesh ref={ref}>
      <mesh rotation={rotation}>
        <WheelModel
          castShadow={castShadow}
          receiveShadow={receiveShadow}
          styled={styled}
          wireframe={wireframe}
          baseColor={baseColor}
        />
      </mesh>
    </mesh>
  )
})

export default Wheel;
