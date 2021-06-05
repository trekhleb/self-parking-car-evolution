import React from 'react';

import { SENSOR_DISTANCE, SENSOR_HEIGHT } from './constants';
import SensorRay from './SensorRay';
import { userCarUUID } from '../types/car';

type SensorsProps = {
  carUUID: userCarUUID,
};

const Sensors = (props: SensorsProps) => {
  const { carUUID } = props;

  return (
    <SensorRay
      from={[0, SENSOR_HEIGHT, 0]}
      to={[0, SENSOR_HEIGHT, SENSOR_DISTANCE]}
      carUUID={carUUID}
    />
  )
};

export default Sensors;
