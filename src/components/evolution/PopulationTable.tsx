import React from 'react';
import { Block } from 'baseui/block';
import { Table, DIVIDER, SIZE as TABLE_SIZE } from 'baseui/table-semantic';
import { Tag, VARIANT as TAG_VARIANT, KIND as TAG_KIND } from 'baseui/tag';
import { Spinner } from 'baseui/spinner';

import { CarLicencePlateType, CarsType, CarType } from '../world/types/car';

export type CarsInProgressType = Record<CarLicencePlateType, boolean>;

type PopulationTableProps = {
  cars: CarsType,
  carsInProgress: CarsInProgressType,
};

function PopulationTable(props: PopulationTableProps) {
  const {cars, carsInProgress} = props;
  const carsArray: CarType[] = Object.values<CarType>(cars);

  const columns = [
    'Licence Plate',
    'Fitness',
  ];

  const rowsData: React.ReactNode[][] = carsArray.map((car: CarType) => {
    const licencePlateCell = (
      <Tag
        closeable={false}
        kind={TAG_KIND.neutral}
        variant={TAG_VARIANT.solid}
      >
        {car.licencePlate}
      </Tag>
    );


    const fitness = null;

    const fitnessCell = carsInProgress[car.licencePlate] ? (
      <Spinner size={24} color="black" />
    ) : (
      <code>{fitness}</code>
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
      />
    </Block>
  );
}

export default PopulationTable;
