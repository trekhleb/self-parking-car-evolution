import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxProps, useRaycastVehicle } from '@react-three/cannon';
import * as THREE from 'three';

import Chassis from './Chassis';
import Wheel from './Wheel';
import {
  CHASSIS_BACK_WHEEL_SHIFT,
  CHASSIS_BASE_COLOR,
  CHASSIS_FRONT_WHEEL_SHIFT,
  CHASSIS_GROUND_CLEARANCE,
  CHASSIS_WHEEL_WIDTH,
  WHEEL_RADIUS
} from './parameters';
import { useKeyPress } from './useKeyPress';

type WheelInfoOptions = {
  radius?: number
  directionLocal?: number[]
  suspensionStiffness?: number
  suspensionRestLength?: number
  maxSuspensionForce?: number
  maxSuspensionTravel?: number
  dampingRelaxation?: number
  dampingCompression?: number
  frictionSlip?: number
  rollInfluence?: number
  axleLocal?: number[]
  chassisConnectionPointLocal?: number[]
  isFrontWheel?: boolean
  useCustomSlidingRotationalSpeed?: boolean
  customSlidingRotationalSpeed?: number
};

export type CarMetaData = {
  uuid: string,
};

type CarProps = {
  uuid: string,
  wheelRadius?: number,
  wireframe?: boolean,
  styled?: boolean,
  controllable?: boolean,
  movable?: boolean,
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
    controllable = false,
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
    radius: wheelRadius,
    directionLocal: [0, -1, 0], // Same as Physics gravity.
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 10000,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    frictionSlip: 5,
    rollInfluence: 0.01,
    axleLocal: [-1, 0, 0], // wheel rotates around X-axis, invert if wheels rotate the wrong way
    chassisConnectionPointLocal: [1, 0, 1],
    isFrontWheel: false,
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
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

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels,
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  const forward = useKeyPress(['w', 'ArrowUp'], controllable);
  const backward = useKeyPress(['s', 'ArrowDown'], controllable);
  const left = useKeyPress(['a', 'ArrowLeft'], controllable);
  const right = useKeyPress(['d', 'ArrowRight'], controllable);
  const brake = useKeyPress([' '], controllable);

  const [steeringValue, setSteeringValue] = useState<number>(0);
  const [engineForce, setEngineForce] = useState<number>(0);
  const [brakeForce, setBrakeForce] = useState<number>(0);

  const maxSteerVal = 0.5;
  const maxForce = 1000;
  const maxBrakeForce = 10000;

  useFrame(() => {
    if (!controllable) {
      return;
    }

    // Left-right.
    if (left && !right) {
      setSteeringValue(maxSteerVal);
    } else if (right && !left) {
      setSteeringValue(-maxSteerVal);
    } else {
      setSteeringValue(0);
    }

    // Front-back.
    if (forward && !backward) {
      setBrakeForce(0);
      setEngineForce(-maxForce);
    } else if (backward && !forward) {
      setBrakeForce(0);
      setEngineForce(maxForce);
    } else if (engineForce !== 0) {
      setEngineForce(0);
    }

    // Break.
    if (brake) {
      setBrakeForce(maxBrakeForce);
    }
    if (!brake) {
      setBrakeForce(0);
    }
  })

  useEffect(() => {
    api.applyEngineForce(engineForce, 2);
    api.applyEngineForce(engineForce, 3);
  }, [engineForce])

  useEffect(() => {
    api.setSteeringValue(steeringValue, 0);
    api.setSteeringValue(steeringValue, 1);
  }, [steeringValue])

  useEffect(() => {
    wheels.forEach((wheel, i) => {
      api.setBrake(brakeForce, i);
    })
  }, [brakeForce])

  const wheelBodyProps = {
    position: bodyProps.position,
  };

  const carMetaData: CarMetaData = { uuid };

  return (
    <group ref={vehicle}>
      <Chassis
        ref={chassis}
        chassisPosition={[0, -0.6, 0]}
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
    </group>
  )
}

export default Car;
