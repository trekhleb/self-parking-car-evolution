import React from 'react';
import { Block } from 'baseui/block';
import { Table, DIVIDER, SIZE as TABLE_SIZE } from 'baseui/table-semantic';
import { Tag, VARIANT as TAG_VARIANT, KIND as TAG_KIND } from 'baseui/tag';
import { StyledSpinnerNext } from 'baseui/spinner';
import { withStyle } from 'baseui';

import { CarLicencePlateType, CarsType, CarType } from '../world/types/car';
import { formatLossValue } from './utils/evolution';
import FadeIn from '../shared/FadeIn';
import { FITNESS_ALPHA, LOSS_VALUE_BAD_THRESHOLD, LOSS_VALUE_GOOD_THRESHOLD } from './constants/evolution';
import { carLossToFitness } from '../../libs/carGenetic';

export type CarsInProgressType = Record<CarLicencePlateType, boolean>;
export type CarsLossType = Record<CarLicencePlateType, number | null>;

type PopulationTableProps = {
  cars: CarsType,
  carsInProgress: CarsInProgressType,
  carsLoss: CarsLossType,
};

const sortTable = true;

const CellSpinner = withStyle(StyledSpinnerNext, {
  width: '18px',
  height: '18px',
  borderLeftWidth: '3px',
  borderRightWidth: '3px',
  borderTopWidth: '3px',
  borderBottomWidth: '3px',
  borderTopColor: 'black',
});

function PopulationTable(props: PopulationTableProps) {
  const { cars, carsInProgress, carsLoss } = props;
  const carsArray: CarType[] = Object.values<CarType>(cars);

  const columns = [
    'Licence Plate',
    'Loss',
    'Fitness',
  ];

  const rowsData: React.ReactNode[][] = carsArray
    .sort((carA: CarType, carB: CarType): number => {
      if (!sortTable) {
        return 0;
      }
      const lossA = getCarLoss(carsLoss, carA);
      const lossB = getCarLoss(carsLoss, carB);
      if (lossA === null && lossB !== null) {
        return 1;
      }
      if (lossA !== null && lossB === null) {
        return -1;
      }
      if (lossA === null || lossB === null) {
        return 0;
      }
      if (lossA === lossB) {
        return 0;
      }
      if (lossA <= lossB) {
        return -1;
      }
      return 1;
    })
    .map((car: CarType) => {
      const licencePlateCell = (
        <Tag
          closeable={false}
          kind={TAG_KIND.neutral}
          variant={TAG_VARIANT.light}
        >
          {car.licencePlate}
        </Tag>
      );

      const carLossFormatted: number | null = getCarLoss(carsLoss, car);
      let carLossColor = '';
      if (carLossFormatted !== null) {
        if (carLossFormatted < LOSS_VALUE_GOOD_THRESHOLD) {
          carLossColor = 'limegreen';
        } else if (carLossFormatted < LOSS_VALUE_BAD_THRESHOLD) {
          carLossColor = 'orange';
        } else {
          carLossColor = 'red';
        }
      }
      const lossCell = carsInProgress[car.licencePlate] ? (
        <FadeIn>
          <CellSpinner />
        </FadeIn>
      ) : (
        <Block color={carLossColor}>
          {carLossFormatted}
        </Block>
      );

      const fitnessValue: number | null = getCarFitness(carsLoss, car);
      const fitnessCell = carsInProgress[car.licencePlate] ? (
        <FadeIn>
          <CellSpinner />
        </FadeIn>
      ) : (
        <Block color={carLossColor}>
          {fitnessValue}
        </Block>
      );

      return [
        licencePlateCell,
        lossCell,
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
          Root: {
            style: {
              maxHeight: '343px',
            },
          },
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

function getCarLoss(carsLoss: CarsLossType, car: CarType): number | null {
  return carsLoss.hasOwnProperty(car.licencePlate) && typeof carsLoss[car.licencePlate] === 'number'
    ? formatLossValue(carsLoss[car.licencePlate])
    : null;
}

function getCarFitness(carsLoss: CarsLossType, car: CarType): number | null {
  return carsLoss.hasOwnProperty(car.licencePlate) && typeof carsLoss[car.licencePlate] === 'number'
    ? formatLossValue(carLossToFitness(carsLoss[car.licencePlate] || 0, FITNESS_ALPHA))
    : null;
}

export default PopulationTable;
