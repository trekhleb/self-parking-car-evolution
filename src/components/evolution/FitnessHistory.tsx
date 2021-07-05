import * as React from 'react';
import { Block } from 'baseui/block';
import { Datum, ResponsiveLine } from '@nivo/line';

import { formatFitnessValue } from './utils/evolution';

type FitnessHistoryProps = {
  history: number[],
};

// @see: Nivo docs: https://nivo.rocks/line
function FitnessHistory(props: FitnessHistoryProps) {
  const {history} = props;
  // const history: number[] = new Array(100).fill(null).map(() => Math.random() * 10);

  const emptyStateData: [number] = [0];
  const chartData: Datum[] = (history.length ? history : emptyStateData).map((fitness: number, generationIndex: number): Datum => {
    const miss = fitness === Infinity ? null : formatFitnessValue(fitness);
    return {
      x: generationIndex,
      y: miss,
    };
  });

  const chart = (
    <ResponsiveLine
      data={[{id: 'miss', data: chartData}]}
      margin={{ top: 3, right: 10, bottom: 42, left: 50 }}
      xScale={history.length <= 20 ? { type: 'point' } : { type: 'linear', min: 0, max: 'auto' }}
      yScale={{ type: 'linear', min: 0, max: 'auto' }}
      yFormat=" >-.2f"
      curve={'monotoneX'}
      axisBottom={{
        legend: 'Generation #',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        legend: 'Target Miss',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={6}
      pointColor={'black'}
      pointBorderWidth={1}
      pointBorderColor={'white'}
      useMesh={true}
      enableCrosshair={true}
      enableSlices={false}
      colors={'black'}
    />
  );

  return (
    <Block
      height="300px"
      $style={{
        fontFamily: 'system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '14px',
      }}
    >
      {chart}
    </Block>
  );
}

export default FitnessHistory;
