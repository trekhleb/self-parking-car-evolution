import * as React from 'react';
import { Block } from 'baseui/block';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Label } from 'recharts';
import { formatFitnessValue } from './utils/evolution';

type FitnessHistoryProps = {
  history: number[],
};

// @see: Re-chart docs: https://recharts.org/en-US
function FitnessHistory(props: FitnessHistoryProps) {
  // const {history} = props;
  const history = [2.5, 12, 5.8, 8.9, Infinity, 15, 2, 8]

  const rechartsData = history.map((fitness: number, generationIndex: number) => {
    return {
      generationIndex,
      miss: fitness === Infinity ? null : formatFitnessValue(fitness),
    };
  });
  const recharts = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={rechartsData}
        margin={{
          top: 1,
          right: 1,
          left: 1,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="generationIndex" type="number">
          <Label value="Generation #" position="bottom" offset={-3} />
        </XAxis>
        <YAxis type="number">
          <Label value="Target Miss" position="insideLeft" angle={-90} offset={20} />
        </YAxis>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="miss"
          strokeWidth={1}
          stroke="#000000"
          activeDot={{ r: 5 }}
          dot={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Block
      height="300px"
      $style={{
        fontFamily: 'system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '14px',
      }}
    >
      {recharts}
    </Block>
  );
}

export default FitnessHistory;
