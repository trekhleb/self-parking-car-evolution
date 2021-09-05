import React, { useRef, useState } from 'react';

import Car from '../car/Car';
import { NumVec3 } from '../../../types/vectors';
import { CHASSIS_BASE_COLOR, CHASSIS_BASE_TOUCHED_COLOR, CHASSIS_LENGTH, CHASSIS_WIDTH } from '../car/constants';
import { CarMetaData } from '../types/car';
import { generateStaticCarUUID } from '../utils/uuid';

type CarBaseColors = Record<string, string>;

type StaticCarsProps = {
  rows: number,
  cols: number,
  collisionFilterGroup: number,
  collisionFilterMask: number,
  skipCells?: number[][],
  performanceBoost?: boolean,
};

function StaticCars(props: StaticCarsProps) {
  const {
    rows,
    cols,
    collisionFilterGroup,
    collisionFilterMask,
    skipCells = [[]],
    performanceBoost = false,
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
  };

  const staticCarPositions: NumVec3[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (skipCells.find(([skipRow, skipCol]) => (skipRow === row && skipCol === col))) {
        continue;
      }
      const marginedLength = 1.4 * CHASSIS_LENGTH;
      const marginedWidth = 3.5 * CHASSIS_WIDTH;
      const x = -0.5 * marginedWidth + row * marginedWidth;
      const z = -2 * marginedLength + col * marginedLength;
      staticCarPositions.push([x, 0.6, z]);
    }
  }

  const staticCars = staticCarPositions.map((position: NumVec3, index: number) => {
    const uuid = generateStaticCarUUID(index);
    const baseColor = uuid in carBaseColors ? carBaseColors[uuid] : CHASSIS_BASE_COLOR;
    return (
      <Car
        key={index}
        uuid={uuid}
        bodyProps={{ position }}
        wireframe={false}
        styled={false}
        movable={false}
        baseColor={baseColor}
        collisionFilterGroup={collisionFilterGroup}
        collisionFilterMask={collisionFilterMask}
        onCollide={onCollide}
        performanceBoost={performanceBoost}
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
