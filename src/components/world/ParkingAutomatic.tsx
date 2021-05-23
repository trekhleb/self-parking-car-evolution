import React, { useCallback, useState, useRef } from 'react';

import Ground from './Ground';
import Car from './Car/Car';
import { CHASSIS_BASE_TOUCHED_COLOR } from './Car/parameters';
import StaticCars from './StaticCars';

type CarBaseColors = Record<string, string>;

// Collision groups and masks must be powers of 2.
// @see: https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html
const COLLISION_GROUP_ACTIVE_CARS = 0b0001;
const COLLISION_GROUP_STATIC_OBJECTS = 0b0010;
const COLLISION_MASK_ACTIVE_CARS = COLLISION_GROUP_STATIC_OBJECTS // It can only collide with static objects.
const COLLISION_MASK_STATIC_OBJECTS = COLLISION_GROUP_ACTIVE_CARS // It can only collide with active cars.

function ParkingAutomatic() {
  const [carBaseColors, setCarBaseColors] = useState<CarBaseColors>({});
  const carBaseColorsRef = useRef<CarBaseColors>({});

  const onCollide = (event: any) => {
    const touchedCarUUID = event?.body?.userData?.uuid;
    if (!touchedCarUUID) {
      return;
    }
    const newCarBaseColors = {
      ...carBaseColorsRef.current,
      [touchedCarUUID]: CHASSIS_BASE_TOUCHED_COLOR,
    };
    carBaseColorsRef.current = newCarBaseColors;
    setCarBaseColors(newCarBaseColors);
    console.log('Bonk!', event.body.userData);
  };

  const onCollideCallback = useCallback(onCollide, [carBaseColors]);

  const activeCarsNum = 10;
  const activeCars = new Array(activeCarsNum).fill(null).map((_, index) => {
    const uuid = `car-population-${index}`;
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
        onCollide={onCollideCallback}
        wireframe={false}
        collisionFilterGroup={COLLISION_GROUP_ACTIVE_CARS}
        collisionFilterMask={COLLISION_MASK_ACTIVE_CARS}
        controllable
        movable
        styled
      />
    );
  });

  return (
    <>
      <Ground
        userData={{ id: 'ground' }}
        collisionFilterGroup={COLLISION_GROUP_STATIC_OBJECTS}
        collisionFilterMask={COLLISION_MASK_STATIC_OBJECTS}
      />
      {activeCars}
      <StaticCars
        rows={2}
        cols={5}
        skipCells={[[0, 2]]}
        carBaseColors={carBaseColors}
        collisionFilterGroup={COLLISION_GROUP_STATIC_OBJECTS}
        collisionFilterMask={COLLISION_MASK_STATIC_OBJECTS}
      />
    </>
  );
}

export default ParkingAutomatic;
