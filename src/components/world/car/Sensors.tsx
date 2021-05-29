import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RootState } from '@react-three/fiber/dist/declarations/src/core/store';
import { Line2 } from 'three/examples/jsm/lines/Line2';

import { SENSOR_DISTANCE, SENSOR_HEIGHT } from './constants';
import SensorRay from './SensorRay';

type SensorsProps = {
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
};

const Sensors = (props: SensorsProps) => {
  const {
    collisionFilterGroup = -1,
    collisionFilterMask = -1,
  } = props;

  const sensorRef1 = useRef<Line2 | undefined>();

  useFrame((state: RootState, delta: number) => {
    // if (sensorRef1.current && chassis.current) {
    //   chassis.current.getWorldQuaternion(sensorRef1.current.quaternion);
    //   chassis.current.getWorldPosition(sensorRef1.current.position);
    //   sensorRef1.current.position.y = SENSOR_HEIGHT;
    // }
  })

  return (
    <SensorRay
      from={[0, SENSOR_HEIGHT, 0]}
      to={[SENSOR_DISTANCE, SENSOR_HEIGHT, 0]}
      collisionFilterGroup={collisionFilterGroup}
      collisionFilterMask={collisionFilterMask}
    />
  )
};

export default Sensors;
