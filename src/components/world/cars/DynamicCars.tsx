import React, { useRef } from 'react';

import Car, { OnCarReadyArgs } from '../car/Car';
import { generateDynamicCarUUID } from '../utils/uuid';
import { CarType, userCarUUID } from '../types/car';
import { carEvents, off, on } from '../utils/events';
import {
  onEngineBackward,
  onEngineForward,
  onEngineNeutral, onPressBreak, onReleaseBreak,
  onWheelsLeft,
  onWheelsRight,
  onWheelsStraight
} from '../utils/controllers';
import { getRandomColor } from '../../../utils/colors';

type DynamicCarsProps = {
  cars: CarType[],
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
  withSensors?: boolean,
  withLabels?: boolean,
  visibleSensors?: boolean,
  controllable?: boolean,
  withRandomColors?: boolean,
};

function DynamicCars(props: DynamicCarsProps) {
  const {
    cars,
    collisionFilterGroup,
    collisionFilterMask,
    withSensors = false,
    visibleSensors = false,
    withLabels = false,
    controllable = false,
    withRandomColors = false,
  } = props;
  const carsUUIDs = useRef<userCarUUID[]>([]);
  const carsAPIs = useRef<Record<userCarUUID, OnCarReadyArgs>>({});

  const activeCars = cars.map((car, index) => {
    const uuid = generateDynamicCarUUID(index);
    carsUUIDs.current.push(uuid);

    const onForward = () => { onEngineForward(carsAPIs.current[uuid].api) };
    const onBackward = () => { onEngineBackward(carsAPIs.current[uuid].api) };
    const onNeutral = () => { onEngineNeutral(carsAPIs.current[uuid].api) };
    const onLeft = () => { onWheelsLeft(carsAPIs.current[uuid].api) };
    const onRight = () => { onWheelsRight(carsAPIs.current[uuid].api) };
    const onStraight = () => { onWheelsStraight(carsAPIs.current[uuid].api) };
    const onBreak = () => { onPressBreak(carsAPIs.current[uuid].api) };
    const onBreakRelease = () => { onReleaseBreak(carsAPIs.current[uuid].api) };

    const onCarReady = (args: OnCarReadyArgs) => {
      carsAPIs.current[uuid] = args;
      if (controllable) {
        on(carEvents.engineForward, onForward);
        on(carEvents.engineBackward, onBackward);
        on(carEvents.engineNeutral, onNeutral);
        on(carEvents.wheelsLeft, onLeft);
        on(carEvents.wheelsRight, onRight);
        on(carEvents.wheelsStraight, onStraight);
        on(carEvents.pressBreak, onBreak);
        on(carEvents.releaseBreak, onBreakRelease);
      }
    };

    const onCarDestroy = () => {
      if (controllable) {
        off(carEvents.engineForward, onForward);
        off(carEvents.engineBackward, onBackward);
        off(carEvents.engineNeutral, onNeutral);
        off(carEvents.wheelsLeft, onLeft);
        off(carEvents.wheelsRight, onRight);
        off(carEvents.wheelsStraight, onStraight);
        off(carEvents.pressBreak, onBreak);
        off(carEvents.releaseBreak, onBreakRelease);
      }
    };

    const position = [0, 2, 4 * Math.random() - 2];
    const angularVelocity = [-0.2, 0, 0];

    const label = withLabels ? (
      <span>score: <span style={{color: 'red'}}>??</span></span>
    ) : null;

    const styledCar = !withRandomColors;
    const carColor = withRandomColors ? getRandomColor() : undefined;

    return (
      <Car
        key={index}
        uuid={uuid}
        label={label}
        bodyProps={{
          position,
          angularVelocity,
        }}
        wireframe={false}
        collisionFilterGroup={collisionFilterGroup}
        collisionFilterMask={collisionFilterMask}
        withSensors={withSensors}
        visibleSensors={visibleSensors}
        onCarReady={onCarReady}
        onCarDestroy={onCarDestroy}
        movable
        styled={styledCar}
        baseColor={carColor}
        car={car}
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
