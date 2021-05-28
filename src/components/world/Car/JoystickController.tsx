import React, { MutableRefObject, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';

import {
  CAR_MAX_BREAK_FORCE,
  CAR_MAX_FORCE,
  CAR_MAX_STEER_VALUE,
} from './constants';
import { useKeyPress } from '../../hooks/useKeyPress';
import { RaycastVehiclePublicApi } from './types';
import ReactNipple from 'react-nipple';

type JoystickControllerProps = {
  vehicleAPI: RaycastVehiclePublicApi,
  wheels: MutableRefObject<THREE.Object3D | undefined>[],
}

function JoystickController(props: JoystickControllerProps) {
  const { vehicleAPI, wheels } = props;

  // const forward = useKeyPress(['w', 'ArrowUp']);
  // const backward = useKeyPress(['s', 'ArrowDown']);
  // const left = useKeyPress(['a', 'ArrowLeft']);
  // const right = useKeyPress(['d', 'ArrowRight']);
  // const brake = useKeyPress([' ']);
  //
  // const [steeringValue, setSteeringValue] = useState<number>(0);
  // const [engineForce, setEngineForce] = useState<number>(0);
  // const [brakeForce, setBrakeForce] = useState<number>(0);
  //
  // useFrame((state: RootState, delta: number) => {
  //   // Left-right.
  //   if (left && !right) {
  //     setSteeringValue(CAR_MAX_STEER_VALUE);
  //   } else if (right && !left) {
  //     setSteeringValue(-CAR_MAX_STEER_VALUE);
  //   } else {
  //     setSteeringValue(0);
  //   }
  //
  //   // Front-back.
  //   if (forward && !backward) {
  //     setBrakeForce(0);
  //     setEngineForce(-CAR_MAX_FORCE);
  //   } else if (backward && !forward) {
  //     setBrakeForce(0);
  //     setEngineForce(CAR_MAX_FORCE);
  //   } else if (engineForce !== 0) {
  //     setEngineForce(0);
  //   }
  //
  //   // Break.
  //   if (brake) {
  //     setBrakeForce(CAR_MAX_BREAK_FORCE);
  //   }
  //   if (!brake) {
  //     setBrakeForce(0);
  //   }
  // })
  //
  // useEffect(() => {
  //   vehicleAPI.applyEngineForce(engineForce, 2);
  //   vehicleAPI.applyEngineForce(engineForce, 3);
  // }, [engineForce]);
  //
  // useEffect(() => {
  //   vehicleAPI.setSteeringValue(steeringValue, 0);
  //   vehicleAPI.setSteeringValue(steeringValue, 1);
  // }, [steeringValue]);
  //
  // useEffect(() => {
  //   wheels.forEach((wheel, i) => {
  //     vehicleAPI.setBrake(brakeForce, i);
  //   })
  // }, [brakeForce]);

  const nippleSize = 100;

  return null;

  return (
    <ReactNipple
      style={{
        width: nippleSize,
        height: nippleSize,
        marginTop: -nippleSize - 20,
        marginLeft: `calc(50% - ${Math.floor(nippleSize / 2)}px)`,
        position: 'absolute',
      }}
      // @see: https://github.com/yoannmoinet/nipplejs#options
      options={{
        color: 'white',
        mode: 'static',
        size: nippleSize,
        position: { top: '50%', left: '50%' }
      }}
      // @see: https://github.com/yoannmoinet/nipplejs#start
      onMove={(evt: any, data: any) => console.log(data.direction)}
      onEnd={(evt: any, data: any) => console.log('end')}
    />
  );
}

export default JoystickController;
