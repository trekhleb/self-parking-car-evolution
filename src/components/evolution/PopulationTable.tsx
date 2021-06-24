import React from 'react';
import { Block } from 'baseui/block';
import { Table, DIVIDER, SIZE as TABLE_SIZE } from 'baseui/table-semantic';
import { Tag, VARIANT as TAG_VARIANT, KIND as TAG_KIND } from 'baseui/tag';
import { Spinner } from 'baseui/spinner';

import { CarLicencePlateType, CarsType, CarType } from '../world/types/car';

export type CarsInProgressType = Record<CarLicencePlateType, boolean>;
export type CarsFitnessType = Record<CarLicencePlateType, number>;

type PopulationTableProps = {
  cars: CarsType,
  carsInProgress: CarsInProgressType,
  carsFitness: CarsFitnessType,
};

function PopulationTable(props: PopulationTableProps) {
  const { cars, carsInProgress, carsFitness } = props;
  const carsArray: CarType[] = Object.values<CarType>(cars);

  const columns = [
    'Licence Plate',
    'Fitness',
  ];

  const rowsData: React.ReactNode[][] = carsArray
    .sort((carA: CarType, carB: CarType): number => {
      const fitnessA = getCarFitness(carsFitness, carA);
      const fitnessB = getCarFitness(carsFitness, carB);
      if (fitnessA === null && fitnessB !== null) {
        return -1;
      }
      if (fitnessA !== null && fitnessB === null) {
        return 1;
      }
      if (fitnessA === null || fitnessB === null) {
        return 0;
      }
      if (fitnessA === fitnessB) {
        return 0;
      }
      if (fitnessA <= fitnessB) {
        return -1;
      }
      return 1;
    })
    .map((car: CarType) => {
      const licencePlateCell = (
        <Tag
          closeable={false}
          kind={TAG_KIND.neutral}
          variant={TAG_VARIANT.solid}
        >
          {car.licencePlate}
        </Tag>
      );

      const carFitness = getCarFitness(carsFitness, car);
      const fitnessCell = carsInProgress[car.licencePlate] ? (
        <Spinner size={24} color="black" />
      ) : (
        <code>
          {carFitness}
        </code>
      );

      return [
        licencePlateCell,
        fitnessCell,
      ];
    });

  return (
    <Block>
      <Table
        columns={columns}
        data={rowsData}
        emptyMessage="No population yet"
        divider={DIVIDER.grid}
        size={TABLE_SIZE.compact}
        overrides={{
          TableBodyCell: {
            style: {
              verticalAlign: 'center',
            },
          },
        }}
      />
    </Block>
  );
}

function getCarFitness(carsFitness: CarsFitnessType, car: CarType): number | null {
  return carsFitness.hasOwnProperty(car.licencePlate) && typeof carsFitness[car.licencePlate] === 'number'
    ? carsFitness[car.licencePlate]
    : null;
}

export default PopulationTable;
