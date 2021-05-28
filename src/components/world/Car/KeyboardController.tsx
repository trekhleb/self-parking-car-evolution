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

type KeyboardControllerProps = {
  vehicleAPI: RaycastVehiclePublicApi,
  wheels: MutableRefObject<THREE.Object3D | undefined>[],
}

function KeyboardController(props: KeyboardControllerProps) {
  const { vehicleAPI, wheels } = props;

  const forward = useKeyPress(['w', 'ArrowUp']);
  const backward = useKeyPress(['s', 'ArrowDown']);
  const left = useKeyPress(['a', 'ArrowLeft']);
  const right = useKeyPress(['d', 'ArrowRight']);
  const brake = useKeyPress([' ']);

  const [steeringValue, setSteeringValue] = useState<number>(0);
  const [engineForce, setEngineForce] = useState<number>(0);
  const [brakeForce, setBrakeForce] = useState<number>(0);

  useFrame((state: RootState, delta: number) => {
    // Left-right.
    if (left && !right) {
      setSteeringValue(CAR_MAX_STEER_VALUE);
    } else if (right && !left) {
      setSteeringValue(-CAR_MAX_STEER_VALUE);
    } else {
      setSteeringValue(0);
    }

    // Front-back.
    if (forward && !backward) {
      setBrakeForce(0);
      setEngineForce(-CAR_MAX_FORCE);
    } else if (backward && !forward) {
      setBrakeForce(0);
      setEngineForce(CAR_MAX_FORCE);
    } else if (engineForce !== 0) {
      setEngineForce(0);
    }

    // Break.
    if (brake) {
      setBrakeForce(CAR_MAX_BREAK_FORCE);
    }
    if (!brake) {
      setBrakeForce(0);
    }
  })

  useEffect(() => {
    vehicleAPI.applyEngineForce(engineForce, 2);
    vehicleAPI.applyEngineForce(engineForce, 3);
  }, [engineForce]);

  useEffect(() => {
    vehicleAPI.setSteeringValue(steeringValue, 0);
    vehicleAPI.setSteeringValue(steeringValue, 1);
  }, [steeringValue]);

  useEffect(() => {
    wheels.forEach((wheel, i) => {
      vehicleAPI.setBrake(brakeForce, i);
    })
  }, [brakeForce]);

  return null;
}

export default KeyboardController;
