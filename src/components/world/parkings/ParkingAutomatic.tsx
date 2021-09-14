import React from 'react';

import Ground from '../surroundings/Ground';
import StaticCars from '../cars/StaticCars';
import DynamicCars from '../cars/DynamicCars';
import { DynamicCarsPosition } from '../constants/cars';
import ParkingSpot from '../surroundings/ParkingSpot';
import { CarType } from '../types/car';

// Collision groups and masks must be powers of 2.
// @see: https://github.com/schteppe/cannon.js/blob/master/demos/collisionFilter.html
const COLLISION_GROUP_ACTIVE_CARS = 0b0001;
const COLLISION_GROUP_STATIC_OBJECTS = 0b0010;
const COLLISION_MASK_ACTIVE_CARS = COLLISION_GROUP_STATIC_OBJECTS // It can only collide with static objects.
const COLLISION_MASK_STATIC_OBJECTS = COLLISION_GROUP_ACTIVE_CARS // It can only collide with active cars.

type ParkingAutomaticProps = {
  cars: CarType[],
  withVisibleSensors?: boolean,
  withLabels?: boolean,
  performanceBoost?: boolean,
  carsPosition?: DynamicCarsPosition,
};

function ParkingAutomatic(props: ParkingAutomaticProps) {
  const {
    cars,
    withVisibleSensors = false,
    withLabels = false,
    performanceBoost = false,
    carsPosition,
  } = props;

  return (
    <>
      <Ground
        userData={{ uuid: 'ground' }}
        collisionFilterGroup={COLLISION_GROUP_STATIC_OBJECTS}
        collisionFilterMask={COLLISION_MASK_STATIC_OBJECTS}
      />
      <ParkingSpot />
      <DynamicCars
        cars={cars}
        collisionFilterGroup={COLLISION_GROUP_ACTIVE_CARS}
        collisionFilterMask={COLLISION_MASK_ACTIVE_CARS}
        controllable
        withSensors
        visibleSensors={withVisibleSensors}
        withLabels={withLabels}
        withRandomColors={false}
        performanceBoost={performanceBoost}
        carsPosition={carsPosition}
      />
      <StaticCars
        rows={2}
        cols={5}
        skipCells={[[0, 2]]}
        collisionFilterGroup={COLLISION_GROUP_STATIC_OBJECTS}
        collisionFilterMask={COLLISION_MASK_STATIC_OBJECTS}
        performanceBoost={performanceBoost}
      />
    </>
  );
}

export default ParkingAutomatic;
