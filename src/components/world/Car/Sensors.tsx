import React from 'react';

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
