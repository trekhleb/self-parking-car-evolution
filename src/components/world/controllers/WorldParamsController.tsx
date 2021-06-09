import React from 'react';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { Block } from 'baseui/block';

type WorldParamsControllerProps = {
  withStat: boolean,
  withSensors: boolean,
  withLabels: boolean,
  onWithStatChange: (state: boolean) => void,
  onWithSensorsChange: (state: boolean) => void,
  onWithLabelsChange: (state: boolean) => void,
};

function WorldParamsController(props: WorldParamsControllerProps) {
  const {
    withStat,
    withSensors,
    withLabels,
    onWithStatChange,
    onWithSensorsChange,
    onWithLabelsChange,
  } = props;

  return (
    <Block marginTop="15px" marginBottom="15px" display="flex" flexDirection="row">
      <Block marginRight="25px">
        <Checkbox
          checked={withSensors}
          // @ts-ignore
          onChange={(e) => onWithSensorsChange(e.target.checked)}
          labelPlacement={LABEL_PLACEMENT.right}
        >
          Sensors
        </Checkbox>
      </Block>
      <Block marginRight="25px">
        <Checkbox
          checked={withLabels}
          // @ts-ignore
          onChange={(e) => onWithLabelsChange(e.target.checked)}
          labelPlacement={LABEL_PLACEMENT.right}
        >
          Score
        </Checkbox>
      </Block>
      <Block marginRight="25px">
        <Checkbox
          checked={withStat}
          // @ts-ignore
          onChange={(e) => onWithStatChange(e.target.checked)}
          labelPlacement={LABEL_PLACEMENT.right}
        >
          Perf stat
        </Checkbox>
      </Block>
    </Block>
  );
}

export default WorldParamsController;
