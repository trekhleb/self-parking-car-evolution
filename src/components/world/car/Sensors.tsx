import React, { useRef } from 'react';
import * as THREE from 'three';

import { CHASSIS_OBJECT_NAME, SENSOR_DISTANCE, SENSOR_HEIGHT } from './constants';
import SensorRay from './SensorRay';
import { useThree } from '@react-three/fiber';
import { CarMetaData } from '../types/car';

type SensorsProps = {
  visibleSensors?: boolean,
};

const Sensors = (props: SensorsProps) => {
  const { visibleSensors = false } = props;
  const obstacles = useRef<THREE.Object3D[]>([]);
  const { scene } = useThree();

  // @ts-ignore
  obstacles.current = scene.children
    .filter((object: THREE.Object3D) => object.type === 'Group')
    .map((object: THREE.Object3D) => object.getObjectByName(CHASSIS_OBJECT_NAME))
    .filter((object: THREE.Object3D | undefined) => {
      if (!object || !object.userData) {
        return false;
      }
      // @ts-ignore
      const userData: CarMetaData = object.userData;
      return userData?.isSensorObstacle;
    });

  const sensorsNum = 16;
  const angleStep = 2 * Math.PI / sensorsNum;
  const sensorRays = new Array(sensorsNum).fill(null).map((_, index) => {
    return (
      <SensorRay
        key={index}
        from={[0, SENSOR_HEIGHT, 0]}
        to={[0, SENSOR_HEIGHT, SENSOR_DISTANCE]}
        angleX={angleStep * index}
        visible={visibleSensors}
        obstacles={obstacles.current}
      />
    );
  });

  return (
    <>
      {sensorRays}
    </>
  )
};

export default Sensors;
