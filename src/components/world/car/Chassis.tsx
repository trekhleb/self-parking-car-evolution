import { BoxProps, useBox } from '@react-three/cannon';
import React, { CSSProperties, forwardRef } from 'react';
import * as THREE from 'three';
import { GroupProps } from '@react-three/fiber';

import { CHASSIS_MASS, CHASSIS_OBJECT_NAME, CHASSIS_SIZE } from './constants';
import { NumVec3 } from '../types/vectors';
import ChassisModel from './ChassisModel';
import Sensors from './Sensors';
import CarLabel from './CarLabel';

type ChassisProps = {
  weight?: number,
  wireframe?: boolean,
  castShadow?: boolean,
  receiveShadow?: boolean,
  withSensors?: boolean,
  visibleSensors?: boolean,
  styled?: boolean,
  label?: React.ReactNode,
  movable?: boolean,
  baseColor?: string,
  chassisPosition: NumVec3,
  bodyProps: BoxProps,
  onCollide?: (event: any) => void,
  userData?: Record<string, any>,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
}

const Chassis = forwardRef<THREE.Object3D | undefined, ChassisProps>((props, ref) => {
  const {
    wireframe = false,
    styled = true,
    castShadow = true,
    receiveShadow = true,
    movable = true,
    withSensors = false,
    visibleSensors = false,
    weight = CHASSIS_MASS,
    label = null,
    baseColor,
    chassisPosition,
    bodyProps,
    userData = {},
    collisionFilterGroup,
    collisionFilterMask,
    onCollide = () => {},
  } = props;

  const boxSize = CHASSIS_SIZE;
  useBox(
    () => ({
      mass: weight,
      allowSleep: false,
      args: boxSize,
      collisionFilterGroup,
      collisionFilterMask,
      onCollide,
      userData,
      type: movable ? 'Dynamic' : 'Static',
      ...bodyProps,
    }),
    // @ts-ignore
    ref
  )

  const groupProps: GroupProps = {
    position: chassisPosition,
  };

  const sensors = withSensors ? (
    <Sensors visibleSensors={visibleSensors} />
  ) : null;

  const carLabel = label ? (
    <CarLabel content={label} />
  ) : null;

  return (
    <group ref={ref} name={CHASSIS_OBJECT_NAME}>
      <mesh>
        <ChassisModel
          bodyProps={groupProps}
          castShadow={castShadow}
          receiveShadow={receiveShadow}
          wireframe={wireframe}
          styled={styled}
          baseColor={baseColor}
        />
      </mesh>
      {sensors}
      {carLabel}
    </group>
  )
})

export default Chassis;
