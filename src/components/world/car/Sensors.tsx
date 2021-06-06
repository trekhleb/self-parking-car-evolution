import React from 'react';

import { SENSOR_DISTANCE, SENSOR_HEIGHT } from './constants';
import SensorRay from './SensorRay';
import { userCarUUID } from '../types/car';

type SensorsProps = {
  carUUID: userCarUUID,
  visibleSensors?: boolean,
};

const Sensors = (props: SensorsProps) => {
  const { carUUID, visibleSensors = false } = props;

  const sensorsNum = 16;
  const angleStep = 2 * Math.PI / sensorsNum;
  const sensorRays = new Array(sensorsNum).fill(null).map((_, index) => {
    return (
      <SensorRay
        key={index}
        from={[0, SENSOR_HEIGHT, 0]}
        to={[0, SENSOR_HEIGHT, SENSOR_DISTANCE]}
        angleX={angleStep * index}
        carUUID={carUUID}
        visible={visibleSensors}
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
