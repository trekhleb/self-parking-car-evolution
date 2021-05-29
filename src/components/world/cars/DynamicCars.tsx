import React, { useEffect, useRef, useState } from 'react';

import Car, { OnCarReadyArgs } from '../car/Car';
import CarKeyboardController from '../controlls/CarKeyboardController';
import { generateDynamicCarUUID } from '../utils/uuid';
import { userCarUUID } from '../car/types';

type DynamicCarsProps = {
  carsNum?: number,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
  withSensors?: boolean,
  withKeyboardController?: boolean,
  withJoystickController?: boolean,
};

function DynamicCars(props: DynamicCarsProps) {
  const {
    carsNum = 1,
    collisionFilterGroup,
    collisionFilterMask,
    withSensors = false,
    withKeyboardController = false,
    withJoystickController = false,
  } = props;
  const [controllableUUID, setControllableUUID] = useState<userCarUUID | undefined>();
  const carsUUIDs = useRef<userCarUUID[]>([]);
  const carsAPIs = useRef<Record<userCarUUID, OnCarReadyArgs>>({});

  const activeCars = new Array(carsNum).fill(null).map((_, index) => {
    const uuid = generateDynamicCarUUID(index);
    carsUUIDs.current.push(uuid);
    const onCarReady = (args: OnCarReadyArgs) => {
      carsAPIs.current[uuid] = args;
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

  // Attach keyboard controller.
  useEffect(() => {
    if (!withKeyboardController || !carsUUIDs.current.length || !carsAPIs.current[carsUUIDs.current[0]]) {
      return;
    }
    setControllableUUID(carsUUIDs.current[0]);
  }, [withKeyboardController])

  const keyboardControls = controllableUUID && withKeyboardController ? (
    <CarKeyboardController
      vehicleAPI={carsAPIs.current[controllableUUID].api}
      wheelsNum={carsAPIs.current[controllableUUID].wheelsNum}
    />
  ) : null;

  return (
    <>
      {activeCars}
      {keyboardControls}
    </>
  );
}

export default DynamicCars;
