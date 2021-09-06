import { BoxProps, useBox } from '@react-three/cannon';
import React, { forwardRef } from 'react';
import * as THREE from 'three';
import { GroupProps } from '@react-three/fiber';

import { CHASSIS_MASS, CHASSIS_OBJECT_NAME, CHASSIS_SIZE } from './constants';
import { NumVec3 } from '../../../types/vectors';
import ChassisModel from './ChassisModel';
import Sensors from './Sensors';
import CarLabel from './CarLabel';
import { SensorValuesType } from '../types/car';
import ChassisModelSimple from './ChassisModelSimple';

type ChassisProps = {
  sensorsNum: number,
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
  onSensors?: (sensors: SensorValuesType) => void,
  performanceBoost: boolean,
}

const Chassis = forwardRef<THREE.Object3D | undefined, ChassisProps>((props, ref) => {
  const {
    sensorsNum,
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
    onSensors = () => {},
    performanceBoost,
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
    <Sensors
      visibleSensors={visibleSensors}
      sensorsNum={sensorsNum}
      onSensors={onSensors}
    />
  ) : null;

  const carLabel = label ? (
    <CarLabel content={label} />
  ) : null;

  const chassisModel = performanceBoost ? (
    <ChassisModelSimple
      bodyProps={groupProps}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      baseColor={baseColor}
    />
  ) : (
    <ChassisModel
      bodyProps={groupProps}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      wireframe={wireframe}
      styled={styled}
      baseColor={baseColor}
    />
  );

  return (
    <group ref={ref} name={CHASSIS_OBJECT_NAME}>
      <mesh>
        {chassisModel}
      </mesh>
      {sensors}
      {carLabel}
    </group>
  )
})

export default Chassis;
