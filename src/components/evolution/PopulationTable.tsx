import React from 'react';
import { Block } from 'baseui/block';
import { Table } from 'baseui/table-semantic';

import { CarsType, CarType } from '../world/car/Car';

type PopulationTableProps = {
  cars: CarsType,
};

function PopulationTable(props: PopulationTableProps) {
  const {cars} = props;
  const carsArray: CarType[] = Object.values<CarType>(cars);

  const columns = [
    'Licence Plate',
    'Car Fitness',
  ];

  const rowsData: React.ReactNode[][] = carsArray.map((car: CarType) => {
    const licencePlateCell = car.licencePlate;
    const fitness = 0;
    return [
      licencePlateCell,
      fitness,
    ];
  });

  return (
    <Block>
      <Table
        columns={columns}
        data={rowsData}
        emptyMessage="No population yet"
      />
    </Block>
  );
}

export default PopulationTable;
