import React, { useCallback, useState, useRef } from 'react';

import Ground from './Ground';
import Car from './Car/Car';
import { NumVec3 } from '../../types/vectors';
import { CHASSIS_BASE_COLOR, CHASSIS_BASE_TOUCHED_COLOR } from './Car/parameters';

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

  const rows = 2;
  const cols = 5
  const carLength = 4;
  const carWidth = 1.7;
  const staticCarPositions: NumVec3[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (row === 0 && col === 2) {
        continue;
      }
      const marginedLength = 1.4 * carLength;
      const marginedWidth = 3.5 * carWidth;
      const x = -0.5 * marginedWidth + row * marginedWidth;
      const z = -2 * marginedLength + col * marginedLength;
      staticCarPositions.push([x, 0.6, z]);
    }
  }
  const staticCars = staticCarPositions.map((position: NumVec3, index: number) => {
    const uuid = `car-static-${index}`;
    const baseColor = uuid in carBaseColors ? carBaseColors[uuid] : CHASSIS_BASE_COLOR;
    return (
      <Car
        key={index}
        uuid={uuid}
        bodyProps={{ position }}
        wireframe={false}
        controllable={false}
        styled={false}
        movable={false}
        baseColor={baseColor}
        collisionFilterGroup={COLLISION_GROUP_STATIC_OBJECTS}
        collisionFilterMask={COLLISION_MASK_STATIC_OBJECTS}
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
      {staticCars}
    </>
  );
}

export default ParkingAutomatic;
