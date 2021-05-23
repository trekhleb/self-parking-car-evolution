import React  from 'react';

import Car from './Car/Car';
import { NumVec3 } from '../../types/vectors';
import { CHASSIS_BASE_COLOR } from './Car/parameters';

type CarBaseColors = Record<string, string>;

type StaticCarsProps = {
  rows: number,
  cols: number,
  carBaseColors: CarBaseColors,
  collisionFilterGroup: number,
  collisionFilterMask: number,
  skipCells?: number[][],
  carLength?: number,
  carWidth?: number,
};

function StaticCars(props: StaticCarsProps) {
  const {
    rows,
    cols,
    carBaseColors,
    collisionFilterGroup,
    collisionFilterMask,
    skipCells = [[]],
    carLength = 4,
    carWidth = 1.7,
  } = props;

  const staticCarPositions: NumVec3[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (skipCells.find(([skipRow, skipCol]) => (skipRow === row && skipCol === col))) {
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
        collisionFilterGroup={collisionFilterGroup}
        collisionFilterMask={collisionFilterMask}
      />
    );
  });

  return (
    <>
      {staticCars}
    </>
  );
}

export default StaticCars;
