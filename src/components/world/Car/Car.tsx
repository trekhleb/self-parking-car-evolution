import React, { MutableRefObject, useRef } from 'react';
import { BoxProps, useRaycastVehicle } from '@react-three/cannon';
import * as THREE from 'three';

import Chassis from './Chassis';
import Wheel from './Wheel';
import {
  CHASSIS_BACK_WHEEL_SHIFT,
  CHASSIS_BASE_COLOR,
  CHASSIS_FRONT_WHEEL_SHIFT,
  CHASSIS_GROUND_CLEARANCE,
  CHASSIS_RELATIVE_POSITION,
  CHASSIS_WHEEL_WIDTH,
  WHEEL_CUSTOM_SLIDING_ROTATION_SPEED,
  WHEEL_DAMPING_COMPRESSION,
  WHEEL_DAMPING_RELAXATION,
  WHEEL_FRICTION_SLIP,
  WHEEL_MAX_SUSPENSION_FORCE,
  WHEEL_MAX_SUSPENSION_TRAVEL,
  WHEEL_RADIUS,
  WHEEL_ROLL_INFLUENCE,
  WHEEL_SUSPENSION_REST_LENGTH,
  WHEEL_SUSPENSION_STIFFNESS
} from './constants';
import { CarMetaData, WheelInfoOptions } from './types';
import Sensors from './Sensors';
import KeyboardController from './KeyboardController';

type CarProps = {
  uuid: string,
  wheelRadius?: number,
  wireframe?: boolean,
  styled?: boolean,
  withKeyboardController?: boolean,
  movable?: boolean,
  withSensors?: boolean,
  baseColor?: string,
  onCollide?: (carMetaData: CarMetaData, event: any) => void,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
  bodyProps: BoxProps,
}

function Car(props: CarProps) {
  const {
    uuid,
    wheelRadius = WHEEL_RADIUS,
    wireframe = false,
    styled = true,
    withSensors = false,
    withKeyboardController = false,
    movable = false,
    baseColor = CHASSIS_BASE_COLOR,
    collisionFilterGroup,
    collisionFilterMask,
    bodyProps = {},
    onCollide = (carMetaData, event) => {},
  } = props;

  const chassis = useRef<THREE.Object3D | undefined>();

  const wheels: MutableRefObject<THREE.Object3D | undefined>[] = [];
  const wheelInfos: WheelInfoOptions[] = [];

  const wheelInfo = {
    isFrontWheel: false,
    radius: wheelRadius,
    directionLocal: [0, -1, 0], // Same as Physics gravity.
    axleLocal: [-1, 0, 0], // wheel rotates around X-axis, invert if wheels rotate the wrong way
    chassisConnectionPointLocal: [1, 0, 1],
    suspensionStiffness: WHEEL_SUSPENSION_STIFFNESS,
    suspensionRestLength: WHEEL_SUSPENSION_REST_LENGTH,
    maxSuspensionForce: WHEEL_MAX_SUSPENSION_FORCE,
    maxSuspensionTravel: WHEEL_MAX_SUSPENSION_TRAVEL,
    dampingRelaxation: WHEEL_DAMPING_RELAXATION,
    dampingCompression: WHEEL_DAMPING_COMPRESSION,
    frictionSlip: WHEEL_FRICTION_SLIP,
    rollInfluence: WHEEL_ROLL_INFLUENCE,
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: WHEEL_CUSTOM_SLIDING_ROTATION_SPEED,
  };

  // FrontLeft [-X, Y, Z].
  const wheel_fl = useRef<THREE.Object3D | undefined>();
  const wheelInfo_fl = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      -CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_FRONT_WHEEL_SHIFT,
    ],
  };

  // FrontRight [X, Y, Z].
  const wheel_fr = useRef<THREE.Object3D | undefined>();
  const wheelInfo_fr = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_FRONT_WHEEL_SHIFT
    ],
  };

  // BackLeft [-X, Y, -Z].
  const wheel_bl = useRef<THREE.Object3D | undefined>();
  const wheelInfo_bl = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      -CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_BACK_WHEEL_SHIFT,
    ],
  };

  // BackRight [X, Y, -Z].
  const wheel_br = useRef<THREE.Object3D | undefined>();
  const wheelInfo_br = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      CHASSIS_WHEEL_WIDTH / 2,
      CHASSIS_GROUND_CLEARANCE,
      CHASSIS_BACK_WHEEL_SHIFT,
    ],
  };

  wheels.push(wheel_fl, wheel_fr, wheel_bl, wheel_br)
  wheelInfos.push(wheelInfo_fl, wheelInfo_fr, wheelInfo_bl, wheelInfo_br)

  const [vehicle, vehicleAPI] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels,
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  const wheelBodyProps = {
    position: bodyProps.position,
  };

  const carMetaData: CarMetaData = { uuid };

  const sensors = withSensors ? (
    <Sensors
      collisionFilterGroup={collisionFilterGroup}
      collisionFilterMask={collisionFilterMask}
    />
  ) : null;

  const keyboardController = withKeyboardController ? (
    <KeyboardController
      vehicleAPI={vehicleAPI}
      wheels={wheels}
    />
  ) : null;

  return (
    <>
      {keyboardController}
      <group ref={vehicle}>
        <Chassis
          ref={chassis}
          chassisPosition={CHASSIS_RELATIVE_POSITION}
          styled={styled}
          wireframe={wireframe}
          movable={movable}
          baseColor={baseColor}
          bodyProps={{ ...bodyProps }}
          onCollide={(event) => onCollide(carMetaData, event)}
          userData={carMetaData}
          collisionFilterGroup={collisionFilterGroup}
          collisionFilterMask={collisionFilterMask}
        />
        <Wheel
          ref={wheel_fl}
          radius={wheelRadius}
          bodyProps={wheelBodyProps}
          styled={styled}
          wireframe={wireframe}
          baseColor={baseColor}
          isLeft
        />
        <Wheel
          ref={wheel_fr}
          radius={wheelRadius}
          bodyProps={wheelBodyProps}
          styled={styled}
          wireframe={wireframe}
          baseColor={baseColor}
        />
        <Wheel
          ref={wheel_bl}
          radius={wheelRadius}
          bodyProps={wheelBodyProps}
          styled={styled}
          wireframe={wireframe}
          baseColor={baseColor}
          isLeft
        />
        <Wheel
          ref={wheel_br}
          radius={wheelRadius}
          bodyProps={wheelBodyProps}
          styled={styled}
          wireframe={wireframe}
          baseColor={baseColor}
        />
        {sensors}
      </group>
    </>
  )
}

export default Car;
