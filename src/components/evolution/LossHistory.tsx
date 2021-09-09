import * as React from 'react';
import { useState } from 'react';
import { Block } from 'baseui/block';
import { Datum, Point, ResponsiveLine, Serie } from '@nivo/line';
import { Checkbox } from 'baseui/checkbox';

import { formatLossValue } from './utils/evolution';

type LossHistoryProps = {
  history: number[],
  avgHistory: number[],
};

// @see: Nivo docs: https://nivo.rocks/line
function LossHistory(props: LossHistoryProps) {
  const {history, avgHistory} = props;

  const [showAvgHistory, setShowAvgHistory] = useState<boolean>(true);
  const [showMinLoss, setShowMinLoss] = useState<boolean>(true);

  const emptyStateHistoryData: [number] = [0];
  const historyData: Datum[] = (history.length ? history : emptyStateHistoryData).map(
    (loss: number, generationIndex: number): Datum => {
      const miss = loss === Infinity ? null : formatLossValue(loss);
      return {
        x: generationIndex,
        y: miss,
      };
    }
  );

  const emptyStateAvgHistoryData: [number] = [0];
  const avgHistoryData: Datum[] = (avgHistory.length ? avgHistory : emptyStateAvgHistoryData).map(
    (loss: number, generationIndex: number): Datum => {
      const miss = loss === Infinity ? null : formatLossValue(loss);
      return {
        x: generationIndex,
        y: miss,
      };
    }
  );

  const chartData: Serie[] = [];

  const minLossSeriesId = 'Min Loss';
  const avgLossSeriesId = 'P50 Avg Loss';

  if (showMinLoss) {
    chartData.push({
      id: minLossSeriesId,
      data: historyData,
      color: 'black',
    });
  }

  if (showAvgHistory) {
    chartData.push({
      id: avgLossSeriesId,
      data: avgHistoryData,
      color: '#AAAAAA',
    });
  }

  const chart = (
    <ResponsiveLine
      data={chartData}
      margin={{ top: 3, right: 10, bottom: 42, left: 50 }}
      xScale={history.length <= 20
        ? { type: 'point' }
        : { type: 'linear', min: 0, max: 'auto' }
      }
      yScale={{ type: 'linear', min: 0, max: 'auto' }}
      yFormat=" >-.2f"
      curve={'monotoneX'}
      axisBottom={{
        legend: 'Generation #',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        legend: 'Loss',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={6}
      pointColor={(datum: Datum) => {
        return datum.color || 'black';
      }}
      pointBorderWidth={1}
      pointBorderColor={'white'}
      useMesh={true}
      enableCrosshair={true}
      enableSlices={false}
      colors={(datum: Datum) => {
        return datum.color || 'black';
      }}
      tooltip={({point}: {point: Point}) => {
        const {data, serieId} = point;
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
                {serieId}: <b>{data.yFormatted}</b>
              </small>
            </Block>
          </Block>
        );
      }}
      legends={[
        {
          anchor: 'top-right',
          direction: 'column',
          justify: false,
          translateX: -10,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 1,
          symbolSize: 8,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
        }
      ]}
    />
  );

  const chartControls = (
    <Block display="flex" flexDirection="row" marginTop="20px" marginLeft="47px">
      <Block marginRight="30px">
        <Checkbox
          disabled={!showAvgHistory}
          checked={showMinLoss}
          onChange={() => setShowMinLoss(!showMinLoss)}
        >
          {minLossSeriesId}
        </Checkbox>
      </Block>

      <Block>
        <Checkbox
          disabled={!showMinLoss}
          checked={showAvgHistory}
          onChange={() => setShowAvgHistory(!showAvgHistory)}
        >
          {avgLossSeriesId}
        </Checkbox>
      </Block>
    </Block>
  );

  return (
    <Block>
      <Block
        height="300px"
        $style={{
          fontFamily: 'system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: '14px',
        }}
      >
        {chart}
      </Block>
      <Block>
        {chartControls}
      </Block>
    </Block>
  );
}

export default LossHistory;
