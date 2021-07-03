import * as React from 'react';
import { Block } from 'baseui/block';

type FitnessHistoryProps = {
  history: number[],
};

function FitnessHistory(props: FitnessHistoryProps) {
  const {history} = props;
  return (
    <Block>
      Chart here
    </Block>
  );
}

export default FitnessHistory;
