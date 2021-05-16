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

type CarProps = {
  wheelRadius?: number,
  wireframe?: boolean,
  styled?: boolean,
  controllable?: boolean,
  movable?: boolean,
  baseColor?: string,
  bodyProps: BoxProps,
}

function Car(props: CarProps) {
  const {
    wheelRadius = WHEEL_RADIUS,
    wireframe = false,
    styled = true,
    controllable = false,
    movable = false,
    baseColor = CHASSIS_BASE_COLOR,
    bodyProps = {},
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
  const wheel_fl = useRef<THREE.Object3D | undefined>()
  const wheelInfo_fl = { ...wheelInfo }
  wheelInfo_fl.chassisConnectionPointLocal = [
    -CHASSIS_WHEEL_WIDTH / 2,
    CHASSIS_GROUND_CLEARANCE,
    CHASSIS_FRONT_WHEEL_SHIFT,
  ]
  wheelInfo_fl.isFrontWheel = true

  // FrontRight [X, Y, Z].
  const wheel_fr = useRef<THREE.Object3D | undefined>()
  const wheelInfo_fr = { ...wheelInfo }
  wheelInfo_fr.chassisConnectionPointLocal = [
    CHASSIS_WHEEL_WIDTH / 2,
    CHASSIS_GROUND_CLEARANCE,
    CHASSIS_FRONT_WHEEL_SHIFT
  ]
  wheelInfo_fr.isFrontWheel = true

  // BackLeft [-X, Y, -Z].
  const wheel_bl = useRef<THREE.Object3D | undefined>()
  const wheelInfo_bl = { ...wheelInfo }
  wheelInfo_bl.isFrontWheel = false
  wheelInfo_bl.chassisConnectionPointLocal = [
    -CHASSIS_WHEEL_WIDTH / 2,
    CHASSIS_GROUND_CLEARANCE,
    CHASSIS_BACK_WHEEL_SHIFT,
  ]

  // BackRight [X, Y, -Z].
  const wheel_br = useRef<THREE.Object3D | undefined>()
  const wheelInfo_br = { ...wheelInfo }
  wheelInfo_br.chassisConnectionPointLocal = [
    CHASSIS_WHEEL_WIDTH / 2,
    CHASSIS_GROUND_CLEARANCE,
    CHASSIS_BACK_WHEEL_SHIFT,
  ]
  wheelInfo_br.isFrontWheel = false

  wheels.push(wheel_fl, wheel_fr, wheel_bl, wheel_br)
  wheelInfos.push(wheelInfo_fl, wheelInfo_fr, wheelInfo_bl, wheelInfo_br)

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels,
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }))

  const forward = useKeyPress(['w', 'ArrowUp'], controllable);
  const backward = useKeyPress(['s', 'ArrowDown'], controllable);
  const left = useKeyPress(['a', 'ArrowLeft'], controllable);
  const right = useKeyPress(['d', 'ArrowRight'], controllable);
  const brake = useKeyPress([' '], controllable);
  const reset = useKeyPress(['r'], controllable);

  const [steeringValue, setSteeringValue] = useState(0)
  const [engineForce, setEngineForce] = useState(0)
  const [brakeForce, setBrakeForce] = useState(0)

  const maxSteerVal = 0.5
  const maxForce = 1000
  const maxBrakeForce = 100000

  useFrame(() => {
    if (!controllable) {
      return;
    }
    if (left && !right) {
      setSteeringValue(maxSteerVal)
    } else if (right && !left) {
      setSteeringValue(-maxSteerVal)
    } else {
      setSteeringValue(0)
    }
    if (forward && !backward) {
      setBrakeForce(0)
      setEngineForce(-maxForce)
    } else if (backward && !forward) {
      setBrakeForce(0)
      setEngineForce(maxForce)
    } else if (engineForce !== 0) {
      setEngineForce(0)
    }
    if (brake) {
      setBrakeForce(maxBrakeForce)
    }
    if (!brake) setBrakeForce(0)
    if (reset) {
      // @ts-ignore
      chassis.current.api.position.set(0, 5, 0)
      // @ts-ignore
      chassis.current.api.velocity.set(0, 0, 0)
      // @ts-ignore
      chassis.current.api.angularVelocity.set(0, 0.5, 0)
      // @ts-ignore
      chassis.current.api.rotation.set(0, -Math.PI / 4, 0)
    }
  })

  useEffect(() => {
    api.applyEngineForce(engineForce, 2)
    api.applyEngineForce(engineForce, 3)
  }, [engineForce])

  useEffect(() => {
    api.setSteeringValue(steeringValue, 0)
    api.setSteeringValue(steeringValue, 1)
  }, [steeringValue])

  useEffect(() => {
    wheels.forEach((wheel, i) => {
      api.setBrake(brakeForce, i);
    })
  }, [brakeForce])

  const wheelBodyProps = {
    position: bodyProps.position,
  };

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
        userData={{
          id: 'vehicle-chassis-id',
        }}
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

function useKeyPress(target: string[], controllable: boolean = true): boolean {
  const [keyPressed, setKeyPressed] = useState(false)

  const downHandler = ({ key }: KeyboardEvent) => {
    if (target.includes(key)) {
      setKeyPressed(true);
    }
  };

  const upHandler = ({ key }: KeyboardEvent) => {
    if (target.includes(key)) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    if (!controllable) {
      return;
    }
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, []);

  return keyPressed
}

export default Car;
