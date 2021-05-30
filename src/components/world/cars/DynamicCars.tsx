import React, { useRef } from 'react';

import Car, { OnCarReadyArgs } from '../car/Car';
import { generateDynamicCarUUID } from '../utils/uuid';
import { userCarUUID } from '../types/car';
import { carEvents, on } from '../utils/events';
import {
  onEngineBackward,
  onEngineForward,
  onEngineNeutral, onPressBreak, onReleaseBreak,
  onWheelsLeft,
  onWheelsRight,
  onWheelsStraight
} from '../utils/controllers';

type DynamicCarsProps = {
  carsNum?: number,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
  withSensors?: boolean,
  controllable?: boolean,
};

function DynamicCars(props: DynamicCarsProps) {
  const {
    carsNum = 1,
    collisionFilterGroup,
    collisionFilterMask,
    withSensors = false,
    controllable = false,
  } = props;
  const carsUUIDs = useRef<userCarUUID[]>([]);
  const carsAPIs = useRef<Record<userCarUUID, OnCarReadyArgs>>({});

  const activeCars = new Array(carsNum).fill(null).map((_, index) => {
    const uuid = generateDynamicCarUUID(index);
    carsUUIDs.current.push(uuid);

    const onCarReady = (args: OnCarReadyArgs) => {
      carsAPIs.current[uuid] = args;
      if (controllable) {
        on(carEvents.engineForward, () => { onEngineForward(args.api) });
        on(carEvents.engineBackward, () => { onEngineBackward(args.api) });
        on(carEvents.engineNeutral, () => { onEngineNeutral(args.api) });
        on(carEvents.wheelsLeft, () => { onWheelsLeft(args.api) });
        on(carEvents.wheelsRight, () => { onWheelsRight(args.api) });
        on(carEvents.wheelsStraight, () => { onWheelsStraight(args.api) });
        on(carEvents.pressBreak, () => { onPressBreak(args.api) });
        on(carEvents.releaseBreak, () => { onReleaseBreak(args.api) });
      }
    };

    const position = [0, 2, 4 * Math.random() - 2];
    const angularVelocity = [-0.2, 0, 0];

    return (
      <Car
        key={index}
        uuid={uuid}
        bodyProps={{
          position,
          angularVelocity,
        }}
        wireframe={false}
        collisionFilterGroup={collisionFilterGroup}
        collisionFilterMask={collisionFilterMask}
        withSensors={withSensors}
        onCarReady={onCarReady}
        movable
        styled
      />
    );
  });

  return (
    <>
      {activeCars}
    </>
  );
}

export default DynamicCars;
