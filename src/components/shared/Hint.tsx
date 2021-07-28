import React from 'react';
import { GoInfo } from 'react-icons/all';
import { Button, SHAPE as BUTTON_SHAPE, KIND as BUTTON_KIND } from 'baseui/button';
import { StatefulTooltip } from 'baseui/tooltip';

type HintProps = {
  hint: string,
};

const Hint = (props: HintProps) => {
  const {hint} = props;

  return (
    <StatefulTooltip
      accessibilityType={'tooltip'}
      content={hint}
    >
      <Button
        shape={BUTTON_SHAPE.round}
        kind={BUTTON_KIND.minimal}
        overrides={{
          BaseButton: {
            style: {
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        }}
      >
        <GoInfo />
      </Button>
    </StatefulTooltip>
  );
};

export default Hint;
