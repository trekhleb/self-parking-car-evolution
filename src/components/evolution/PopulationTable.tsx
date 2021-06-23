import React from 'react';
import { Block } from 'baseui/block';
import { Table, DIVIDER, SIZE as TABLE_SIZE } from 'baseui/table-semantic';
import { Tag, VARIANT as TAG_VARIANT, KIND as TAG_KIND } from 'baseui/tag';

import { CarsType, CarType } from '../world/types/car';

type PopulationTableProps = {
  cars: CarsType,
};

function PopulationTable(props: PopulationTableProps) {
  const {cars} = props;
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

    const fitness = (
      <code>
        todo
      </code>
    );
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
        divider={DIVIDER.grid}
        size={TABLE_SIZE.compact}
      />
    </Block>
  );
}

export default PopulationTable;