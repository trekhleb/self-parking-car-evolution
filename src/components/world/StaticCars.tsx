import React, { useCallback, useRef, useState } from 'react';

import Car, { CarMetaData } from './Car/Car';
import { NumVec3 } from '../../types/vectors';
import { CHASSIS_BASE_COLOR, CHASSIS_BASE_TOUCHED_COLOR } from './Car/parameters';

type CarBaseColors = Record<string, string>;

type StaticCarsProps = {
  rows: number,
  cols: number,
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
    collisionFilterGroup,
    collisionFilterMask,
    skipCells = [[]],
    carLength = 4,
    carWidth = 1.7,
  } = props;

  const [carBaseColors, setCarBaseColors] = useState<CarBaseColors>({});
  const carBaseColorsRef = useRef<CarBaseColors>({});

  const onCollide = (carMetaData: CarMetaData, event: any) => {
    const touchedCarUUID = carMetaData.uuid;
    if (!touchedCarUUID) {
      return;
    }
    const newCarBaseColors = {
      ...carBaseColorsRef.current,
      [touchedCarUUID]: CHASSIS_BASE_TOUCHED_COLOR,
    };
    carBaseColorsRef.current = newCarBaseColors;
    setCarBaseColors(newCarBaseColors);
    console.log('Bonk!', {self: carMetaData, target: event.body.userData});
  };

  const onCollideCallback = useCallback(onCollide, [carBaseColors]);

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
        onCollide={onCollideCallback}
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
