import React from 'react';

import Car from './Car/Car';

type DynamicCarsProps = {
  carsNum?: number,
  collisionFilterGroup?: number,
  collisionFilterMask?: number,
};

function DynamicCars(props: DynamicCarsProps) {
  const { carsNum = 1, collisionFilterGroup, collisionFilterMask } = props;

  const activeCars = new Array(carsNum).fill(null).map((_, index) => {
    const uuid = `car-dynamic-${index}`;
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
        controllable
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
