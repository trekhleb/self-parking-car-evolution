import * as React from 'react';
import { Block } from 'baseui/block';
import { Datum, Point, ResponsiveLine } from '@nivo/line';

import { formatLossValue } from './utils/evolution';

type LossHistoryProps = {
  history: number[],
};

// @see: Nivo docs: https://nivo.rocks/line
function LossHistory(props: LossHistoryProps) {
  const {history} = props;

  const emptyStateData: [number] = [0];
  const chartData: Datum[] = (history.length ? history : emptyStateData).map((loss: number, generationIndex: number): Datum => {
    const miss = loss === Infinity ? null : formatLossValue(loss);
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
        legend: 'Min Loss',
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
      tooltip={({point}: {point: Point}) => {
        const {data} = point;
        return (
          <Block $style={{
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '8px',
            boxShadow: '0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)'
          }}>
            <Block marginBottom="3px">
              <small>
                Generation: <b>{data.xFormatted}</b>
              </small>
            </Block>
            <Block>
              <small>
                Target Miss: <b>{data.yFormatted}</b>
              </small>
            </Block>
          </Block>
        );
      }}
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

export default LossHistory;
